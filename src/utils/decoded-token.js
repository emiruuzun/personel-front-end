import jwt_decode from 'jwt-decode';

export const decodeToken = (token) => {
    const gettoken =token; 
    const decodedToken = jwt_decode(gettoken);
    
    return decodedToken;
}