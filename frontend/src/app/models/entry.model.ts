export interface Entry {
  id: string;
  memberName: string;
  level: number;
  comment: string | null;
  recordedAt: string;
}

export interface CreateEntryRequest {
  memberName: string;
  level: number;
  comment?: string;
  recordedDate?: string;
}
