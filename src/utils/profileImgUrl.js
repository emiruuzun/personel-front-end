const profileImageUrl = process.env.REACT_APP_PROFILE_IMG_URL;

export const getProfileImageUrl = (imageName) => {
    return `${profileImageUrl}${imageName}`;
  };
  