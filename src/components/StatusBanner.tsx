interface Props {
  message: string;
}

const StatusBanner: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="text-center text-sm text-green-400 bg-green-800/20 rounded p-2">
      {message}
    </div>
  );
};

export default StatusBanner;
