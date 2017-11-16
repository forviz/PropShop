import * as contentful from 'contentful';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

export const get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await client.getEntry(id);
    res.json({
      data: {
        content: response.fields.content,
      },
    });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};
