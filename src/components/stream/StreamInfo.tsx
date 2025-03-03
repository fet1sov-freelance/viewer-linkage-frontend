interface StreamInfoProps {
  username: string;
  viewerCount: number;
  followerCount: number;
  title?: string;
  latestDonation?: {
    amount: number;
    username: string;
  };
}

export function StreamInfo({ 
  username, 
  viewerCount, 
  followerCount, 
  title,
  latestDonation 
}: StreamInfoProps) {
  return (
    <div className="bg-card rounded-lg p-6 flex items-center justify-between border-2 border-[#9b87f5]">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-2xl font-bold">{username[0]?.toUpperCase()}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{username}</h2>
          {title && <p className="text-lg mb-1">{title}</p>}
          <p className="text-muted-foreground">
            {viewerCount.toLocaleString()} зрителей • {followerCount.toLocaleString()} подписчиков
          </p>
          {latestDonation && (
            <div className="mt-2 text-sm">
              <span className="text-green-500 font-medium">
                Последний донат: {latestDonation.amount.toLocaleString()}$ от {latestDonation.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}