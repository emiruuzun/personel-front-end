import jwt_decode from "jsonwebtoken";

export const getUserRoleFromToken = (token) => {
  try {
    const decodedToken = jwt_decode(token);
    console.log(decodedToken)
    return decodedToken.role;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};
