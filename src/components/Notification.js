const Notification = ({ message }) => {
  const messageStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  if (message === null) {
    return null;
  }

  return (
    <div style={messageStyle} className='error'>
      {message}
    </div>
  );
};

export default Notification;
