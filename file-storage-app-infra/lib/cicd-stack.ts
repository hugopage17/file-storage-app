import { Construct } from 'constructs';
import { NestedStack, SecretValue } from 'aws-cdk-lib';
import { Pipeline, Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { PipelineProject, BuildSpec, LinuxBuildImage, BuildEnvironmentVariableType } from 'aws-cdk-lib/aws-codebuild';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { Bucket } from 'aws-cdk-lib/aws-s3';

interface Props {
  spaHostingBucket: Bucket;
  appCdn: CloudFrontWebDistribution;
  appName: string;
  githubSecretName: string;
}

interface IBuildProject {
  id: string;
  buildspec: string;
  envVariables: {
    [key: string]: {
      type: BuildEnvironmentVariableType;
      value: string;
    };
  };
}

export class CICDStack extends NestedStack {
  private readonly stage: string;
  private readonly appName: string;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { spaHostingBucket, appCdn, appName, githubSecretName } = props;
    this.appName = appName;
    const sourceOutput = new Artifact(`pipeline-artifact`);

    const sourceAction = new GitHubSourceAction({
      actionName: 'GithubSource',
      repo: 'file-storage-app',
      owner: 'hugopage17',
      oauthToken: SecretValue.secretsManager(githubSecretName),
      branch: 'develop',
      output: sourceOutput,
    });

    const sourceStage = {
      stageName: 'Source',
      actions: [sourceAction],
    };

    const buildArtifact = new Artifact(`build-artifact`);

    const reactAppBuildProject = this.buildProject({
      id: 'ReactAppBuildProject',
      buildspec: 'frontend/buildspec.yml',
      envVariables: {
        S3_BUCKET: { type: BuildEnvironmentVariableType.PLAINTEXT, value: `s3://${spaHostingBucket.bucketName}` },
        DISTRIBUTION_ID: { type: BuildEnvironmentVariableType.PLAINTEXT, value: appCdn.distributionId },
        REPO: { type: BuildEnvironmentVariableType.PLAINTEXT, value: 'frontend' },
      },
    });

    const restApiBuildProject = this.buildProject({
      id: 'RestApiBuildProject',
      buildspec: 'rest-api/buildspec.yml',
      envVariables: {
        REPO: { type: BuildEnvironmentVariableType.PLAINTEXT, value: 'rest-api' },
      },
    });

    spaHostingBucket.grantReadWrite(reactAppBuildProject);
    appCdn.grantCreateInvalidation(reactAppBuildProject);

    const buildStage = {
      stageName: 'Build',
      actions: [
        new CodeBuildAction({
          actionName: 'ReactAppBuild',
          project: reactAppBuildProject,
          input: sourceOutput,
          outputs: [buildArtifact],
        }),
        new CodeBuildAction({
          actionName: 'RestAPIBuild',
          project: restApiBuildProject,
          input: sourceOutput,
          outputs: [],
        }),
      ],
    };

    const pipeline = new Pipeline(this, `file-storage-app-pipeline`, {
      pipelineName: `file-storage-app-pipeline`,
      stages: [sourceStage, buildStage],
    });
  }

  private buildProject({ id, buildspec, envVariables }: IBuildProject) {
    return new PipelineProject(this, `${this.appName}-${id}-pipeline-project`, {
      buildSpec: BuildSpec.fromSourceFilename(buildspec),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        environmentVariables: { ...envVariables },
      },
    });
  }
}
