import { useEffect, useState } from "react";

function ApiImage(url) {
  const TOKEN = localStorage.getItem("@ACCESS_TOKEN");
  const api = process.env.REACT_APP_API_KEY;
  const [img, setImg] = useState(null);
  const HEADER = {
    headers: { Authorization: `Bearer ${TOKEN}` },
  };

  useEffect(() => {
    fetch(api + url, HEADER)
      .then(async (res) => {
        if (res.status === 404 || res.status === 500) {
          setImg(null);
        } else {
          const imageBlob = await res.blob();
          setImg(URL.createObjectURL(imageBlob));
        }
      })
      .catch((err) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return img;
}
export default ApiImage;
