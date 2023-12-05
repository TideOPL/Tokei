import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({

  publicRoutes: ["/", "/:locale/sign-in"],
});

export const config = {
  matcher: ["/(api|trpc)(.*)", "/dashboard"],
};