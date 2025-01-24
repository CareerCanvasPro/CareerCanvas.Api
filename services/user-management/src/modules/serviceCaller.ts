import axios from 'axios';

import config from "../../config/config"

export default class ServiceCaller {

    async getSignedUrl(token:any ,imageGallery:any): Promise<{ data?: any }> {
        try {
            const response = await axios.post(`${config.service.mediaservice}/media/getsignedurl`,{
                imageGallery:imageGallery},
            { 
                headers: { authorization: token }
            }
            );

            if (response.status === 200) {
                return { data: response};
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }

    async getSignedUrlTrustbadge(token:any ,url:any): Promise<{ data?: any }> {
        try {
            const response = await axios.post(`${config.service.mediaservice}/media/getsignedurlTrustbadge`,{
                url:url},
            { 
                headers: { authorization: token }
            }
            );

            if (response.status === 200) {
                return { data: response?.data};
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }

    async checkIsViewContact(token:any ,searchId:any): Promise<{ data?: any }> {
        try {
            const response = await axios.post(`${config.service.activityservice}/activity/contact-view-verify`,{
                searchId:searchId},
            { 
                headers: { authorization: token }
            }
            );

            if (response.status === 200) {
                return  response?.data;
            } else {
                return  {data:false}; 
            }
        } catch (error) {
            return { data: error };
        }
    }
    
    
}
