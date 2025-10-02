export type VendorSchema = {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
    description: string;
    tags: string[];
}

export type DatabaseSchema = {
  public: {
    Tables: {
      Vendors: {
        Row: VendorSchema;
        Insert: Omit<VendorSchema, 'id'>;
        Update: Partial<Omit<VendorSchema, 'id'>>;
      };
    };
  };
};