export type CreateUserPayload = {
  username: string;
  address: string;
  profilePic: string;
};

export type SendFeedbackInput = {
  feedback: string;
  wallet?: string;
};
