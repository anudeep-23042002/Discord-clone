"use client"
import { useSocket } from './providers/socket-provider';
import { Badge } from './ui/badge';

const Socketindicator = () => {
  const {socket,isConnected} = useSocket();
  if (!isConnected) {
    return (
      <div >
        <Badge>
          Fallback: Every polling 1s
        </Badge>
      </div>
    );
  }

  return (
    <div>
      <Badge>
        Live: Real time Updates
      </Badge>
    </div>
  );
};

export default Socketindicator;
