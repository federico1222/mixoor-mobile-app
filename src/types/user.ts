export type CreateUserPayload = {
  username: string;
  address: string;
  profilePic: string;
};

export type SendFeedbackInput = {
  feedback: string;
  wallet?: string;
};

export interface UserDetails {
  address: string;
  avatarUri: string;
  createdAt: string;
  username: string;
}
