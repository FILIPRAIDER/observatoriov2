export type DashboardCategory =
  | "educacion"
  | "economia"
  | "demografia"
  | "infraestructura"
  | "salud"
  | "otro";

export interface Dashboard {
  id: bigint;
  name: string;
  description: string | null;
  embed_url: string;
  workspace_id: string | null;
  report_id: string;
  category: DashboardCategory;
  is_active: boolean;
  sort_order: number;
  thumbnail_url: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// Tipos para publicaciones con múltiples autores
export interface Author {
  id: bigint;
  first_name: string;
  last_name: string;
  birth_date: Date;
  organization: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AuthorPublication {
  id: bigint;
  author_id: bigint;
  publication_id: bigint;
  sort_order: number;
  created_at: Date | null;
  updated_at: Date | null;
  authors: Author;
}

export interface PublicationType {
  id: bigint;
  name: string;
  description: string;
  allows_pdf: boolean;
  requires_pdf: boolean;
  has_event_dates: boolean;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Image {
  id: bigint;
  publication_id: bigint;
  file_id: string | null;
  url: string;
  provider: string;
  width: number | null;
  height: number | null;
  size: bigint | null;
  mime: string | null;
  alt: string | null;
  caption: string | null;
  sort_order: number;
  metadata: any;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Publication {
  id: bigint;
  title: string;
  abstract: string;
  content: string;
  pdf_url: string | null;
  pdf_file_id: string | null;
  pdf_original_name: string | null;
  pdf_size: bigint | null;
  event_date: Date | null;
  submission_deadline: Date | null;
  registration_deadline: Date | null;
  external_url: string | null;
  is_featured: boolean;
  keywords: string | null;
  publication_date: Date;
  author_id: bigint;
  publication_type_id: bigint;
  created_at: Date | null;
  updated_at: Date | null;
}

// Tipo helper para publicaciones con relaciones expandidas
export interface PublicationWithRelations extends Publication {
  author_publication: AuthorPublication[];
  publication_types: PublicationType;
  images: Image[];
}

// Tipo helper para vista simplificada con autores formateados
export interface PublicationFormatted {
  id: bigint;
  title: string;
  abstract: string;
  content: string;
  publication_date: Date;
  is_featured: boolean;
  pdf_url: string | null;
  pdf_original_name: string | null;
  keywords: string | null;
  authorsList: {
    id: bigint;
    fullName: string;
    firstName: string;
    lastName: string;
    organization: string;
  }[];
  publicationType: {
    name: string;
    color: string | null;
    icon: string | null;
  };
  mainImage: {
    url: string;
    alt: string | null;
  } | null;
}
