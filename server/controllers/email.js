export const sendEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    console.log('USERNAMEnEMAIL', username, email);
    
    res.json(email);
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
}