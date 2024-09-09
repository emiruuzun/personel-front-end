import React from 'react';

function Button(props) {
  const { butonName } = props;

  return (
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
    >
      {butonName}
    </button>
  );
}

export default Button;
