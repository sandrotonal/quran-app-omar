
import axios from 'axios';

interface QiblaResponse {
    code: number;
    status: string;
    data: {
        latitude: number;
        longitude: number;
        direction: number;
    }
}

export const QiblaService = {
    async getQiblaDirection(latitude: number, longitude: number): Promise<number | null> {
        try {
            const response = await axios.get<QiblaResponse>(
                `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
            );

            if (response.data.code === 200) {
                return response.data.data.direction;
            }
            return null;
        } catch (error) {
            console.error("Error fetching Qibla direction:", error);
            return null;
        }
    }
};
