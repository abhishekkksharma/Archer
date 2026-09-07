const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export interface IProject {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  type?: string;
  experienceLevel?: string;
  status?: string;
  progress?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

class ClientProjectServices {
  public async fetchUserProjects(token?: string) {
    try {
      const res = await fetch(`${backendUrl}/project`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        return (data.projects as IProject[]) || [];
      }
    } catch (err) {
      console.error("Failed to fetch user projects:", err);
    }
    return [];
  }
}

export default new ClientProjectServices();