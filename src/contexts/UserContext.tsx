import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserStats {
  playlists: number;
  followers: string;
  following: number;
}

interface UserData {
  name: string;
  avatar: string;
  membership: string;
  since: string;
  stats: UserStats;
}

interface UserContextType {
  userData: UserData;
  updateUser: (newData: Partial<UserData>) => void;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const defaultUser: UserData = {
  name: 'Khushi Sinha',
  avatar: 'https://picsum.photos/seed/user/200/200',
  membership: 'Premium Member',
  since: '2023',
  stats: {
    playlists: 128,
    followers: '2.4k',
    following: 452,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUser);

  const updateUser = (newData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserData((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...newStats },
    }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, updateStats }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
