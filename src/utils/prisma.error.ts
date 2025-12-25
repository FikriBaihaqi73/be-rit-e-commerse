import { Prisma } from "#generated/client";

function isPrismaClientKnownRequestError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Error &&
    "code" in error &&
    "meta" in error &&
    typeof (error as any).code === "string"
  );
}

function isPrismaError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export { isPrismaClientKnownRequestError, isPrismaError };
