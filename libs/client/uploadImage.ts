import axios from 'axios';

const uploadImage = async (file: File) => {
  try {
    if (!file) {
      throw new Error('Please select a file');
    }

    const {
      data: { url },
    } = (await axios.get('/api/image')).data;
    const formData = new FormData();

    formData.append('file', file as File);

    const {
      data: {
        result: { id },
      },
    } = await axios.post(url, formData);

    return id;
  } catch (e) {
    return console.error(e);
  }
};

export default uploadImage;
