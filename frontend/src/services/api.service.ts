import { fetchAuthSession } from 'aws-amplify/auth'
import { Axios } from "axios"

class APIService {
    private readonly axiosClient: Axios;

    constructor(){
        this.axiosClient = new Axios({
            baseURL: 'https://num1w1i8d2.execute-api.ap-southeast-2.amazonaws.com/dev',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    async listStorage(directory: string) {
        try {
            const authSession = await fetchAuthSession();
            const idToken = authSession.tokens?.idToken?.toString();
            const res = await this.axiosClient.post('/storage/list', JSON.stringify({ directory }), {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                }
            })
            return JSON.parse(res.data);
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async upload(uploadParams: any) {
        try {
            const authSession = await fetchAuthSession();
            const idToken = authSession.tokens?.idToken?.toString();
            const res = await this.axiosClient.post('/storage/upload', JSON.stringify(uploadParams), {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                }
            })
            console.log(res.data)
            return JSON.parse(res.data);
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async deleteObject(filePath: string) {
        try {
            const authSession = await fetchAuthSession();
            const idToken = authSession.tokens?.idToken?.toString();
            await this.axiosClient.delete('/storage/delete', {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
                data: JSON.stringify({
                    path: filePath
                })
            })
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async download(filePath: string) {
        try {
            const authSession = await fetchAuthSession();
            const idToken = authSession.tokens?.idToken?.toString();
            const res = await this.axiosClient.post('/storage/download', JSON.stringify({ path: filePath }), {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                }
            });
            return JSON.parse(res.data);
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
}

export const apiService = new APIService();