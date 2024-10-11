const StatusDisplay = ({ statusCode }) => {
  const getStatusColor = (code) => {
    if (code >= 200 && code < 300) return 'green';
    if (code >= 300 && code < 400) return 'blue';
    if (code >= 400 && code < 500) return 'orange';
    if (code >= 500) return 'red';
    return 'gray'; // Default color for unknown status codes
  };

  const style = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: getStatusColor(statusCode),
  };

  return (
    <span style={style}>
      {statusCode}
    </span>
  );
};

export default StatusDisplay;