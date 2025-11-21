"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Obtiene una publicación completa con todos sus autores, imágenes y detalles
 * Útil para la página de detalle de publicación
 */
export const getPublicationWithAuthors = cache(async (id: number) => {
  const publication = await prisma.publications.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      author_publication: {
        include: {
          authors: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              organization: true,
              birth_date: true,
            },
          },
        },
        orderBy: {
          sort_order: "asc",
        },
      },
      publication_types: true,
      images: {
        orderBy: {
          sort_order: "asc",
        },
      },
    },
  });

  if (!publication) return null;

  // Formatear autores para fácil acceso
  const authors = publication.author_publication.map((ap) => ({
    id: Number(ap.authors.id),
    fullName: `${ap.authors.first_name} ${ap.authors.last_name}`,
    firstName: ap.authors.first_name,
    lastName: ap.authors.last_name,
    organization: ap.authors.organization,
    birthDate: ap.authors.birth_date,
  }));

  return {
    ...publication,
    id: Number(publication.id),
    authors,
    publication_type_id: Number(publication.publication_type_id),
    author_id: Number(publication.author_id),
  };
});

/**
 * Obtiene publicaciones de un autor específico
 */
export const getPublicationsByAuthor = cache(async (authorId: number) => {
  const publications = await prisma.publications.findMany({
    where: {
      author_publication: {
        some: {
          author_id: BigInt(authorId),
        },
      },
    },
    include: {
      author_publication: {
        include: {
          authors: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              organization: true,
            },
          },
        },
        orderBy: {
          sort_order: "asc",
        },
      },
      publication_types: {
        select: {
          name: true,
          color: true,
          icon: true,
        },
      },
      images: {
        take: 1,
        orderBy: {
          sort_order: "asc",
        },
        select: {
          url: true,
          alt: true,
        },
      },
    },
    orderBy: {
      publication_date: "desc",
    },
  });

  return publications.map((pub) => ({
    ...pub,
    id: Number(pub.id),
    authors: pub.author_publication.map((ap) => ({
      id: Number(ap.authors.id),
      fullName: `${ap.authors.first_name} ${ap.authors.last_name}`,
      firstName: ap.authors.first_name,
      lastName: ap.authors.last_name,
      organization: ap.authors.organization,
    })),
  }));
});

/**
 * Obtiene todos los autores disponibles
 */
export const getAllAuthors = cache(async () => {
  const authors = await prisma.authors.findMany({
    include: {
      _count: {
        select: {
          author_publication: true,
        },
      },
    },
    orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
  });

  return authors.map((author) => ({
    id: Number(author.id),
    fullName: `${author.first_name} ${author.last_name}`,
    firstName: author.first_name,
    lastName: author.last_name,
    organization: author.organization,
    birthDate: author.birth_date,
    publicationsCount: author._count.author_publication,
  }));
});

/**
 * Obtiene detalles de un autor con todas sus publicaciones
 */
export const getAuthorWithPublications = cache(async (authorId: number) => {
  const author = await prisma.authors.findUnique({
    where: {
      id: BigInt(authorId),
    },
    include: {
      author_publication: {
        include: {
          publications: {
            include: {
              publication_types: {
                select: {
                  name: true,
                  color: true,
                  icon: true,
                },
              },
              images: {
                take: 1,
                orderBy: {
                  sort_order: "asc",
                },
                select: {
                  url: true,
                  alt: true,
                },
              },
            },
          },
        },
        orderBy: {
          publications: {
            publication_date: "desc",
          },
        },
      },
    },
  });

  if (!author) return null;

  return {
    id: Number(author.id),
    fullName: `${author.first_name} ${author.last_name}`,
    firstName: author.first_name,
    lastName: author.last_name,
    organization: author.organization,
    birthDate: author.birth_date,
    publications: author.author_publication.map((ap) => ({
      id: Number(ap.publications.id),
      title: ap.publications.title,
      abstract: ap.publications.abstract,
      publicationDate: ap.publications.publication_date,
      isFeatured: ap.publications.is_featured,
      pdfUrl: ap.publications.pdf_url,
      publicationType: ap.publications.publication_types,
      mainImage: ap.publications.images[0] || null,
    })),
  };
});
