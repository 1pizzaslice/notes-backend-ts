

type User = {
  _id: string;
  isAdmin: boolean;
};

const sessionIdToUserMap = new Map<string, User>();

function setUser(id: string, user: User): void {
  sessionIdToUserMap.set(id, user);
}

function getUser(id: string): User | undefined {
  return sessionIdToUserMap.get(id);
}

export { setUser, getUser };
