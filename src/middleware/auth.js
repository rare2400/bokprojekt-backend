// Middleware that verifies the JWT token and checks if the user is authenticated
export async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
    } catch (error) {
        reply.code(401).send({ error: "Ingen giltig inloggning" });
    }
}

// Check if user owns a review
export function requireOwnership(resourceUserId, request) {
    return request.user.id === resourceUserId.toString();
}