import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

export type UserRole = "Admin" | "Member" | "Removed";
export type LeadType = "ReceptoNet" | "OrgNetwork";
export type LikeStatus = "liked" | "disliked" | null;

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  lastActive: string;
  generated?: number;
  unlocked?: number;
  assignedLeadsCount?: number;
}

export interface Lead {
  id: number;
  name: string;
  location: string;
  description: string;
  type: LeadType;
  source?: string;
  time: string;
  groupName?: string;
  people?: string[];
  score?: number | null;
  creditCost: number;
  isUnlocked: boolean;
  assignedTo?: string | null;
  likeStatus?: LikeStatus;
}

interface OrganizationState {
  orgName: string;
  users: User[];
  leads: Lead[];
  credits: number;
}

interface AppContextType extends OrganizationState {
  currentUser: User | null;
  login: (username: string) => boolean;
  logout: () => void;
  updateLead: (updatedLead: Lead) => void;
  unlockLead: (leadId: number) => boolean;
  assignLead: (leadId: number, userId: string) => void;
  likeLead: (leadId: number) => void;
  dislikeLead: (leadId: number) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
}

const initialMockUsers: User[] = [
  {
    id: "u1",
    name: "Sarah Chen",
    avatar: "https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?t=st=1745176713~exp=1745180313~hmac=ae28ad636311846eb7fe538dd8f6e3e8f2571fbf4a864d697fdd5bcf615b3fed&w=740",
    role: "Admin",
    lastActive: "Now",
    generated: 12,
    unlocked: 10,
    assignedLeadsCount: 5,
  },
  {
    id: "u2",
    name: "Marcus Rodriguez",
    avatar: "https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?t=st=1745176713~exp=1745180313~hmac=ae28ad636311846eb7fe538dd8f6e3e8f2571fbf4a864d697fdd5bcf615b3fed&w=740",
    role: "Member",
    lastActive: "2 min ago",
    generated: 123,
    unlocked: 123,
    assignedLeadsCount: 40,
  },
  {
    id: "u3",
    name: "Priya Patel",
    avatar: "https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?t=st=1745176713~exp=1745180313~hmac=ae28ad636311846eb7fe538dd8f6e3e8f2571fbf4a864d697fdd5bcf615b3fed&w=740",
    role: "Member",
    lastActive: "1 hr ago",
    generated: 56,
    unlocked: 56,
    assignedLeadsCount: 15,
  },
  {
    id: "u4",
    name: "James Wilson",
    avatar: "https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?t=st=1745176713~exp=1745180313~hmac=ae28ad636311846eb7fe538dd8f6e3e8f2571fbf4a864d697fdd5bcf615b3fed&w=740",
    role: "Removed",
    lastActive: "Yesterday",
    generated: 23,
    unlocked: 23,
    assignedLeadsCount: 25,
  },
];

const initialMockLeads: Lead[] = [
  {
    id: 1,
    name: "Nexus AI Solutions",
    location: "San Francisco, USA",
    description: "Seeking seed funding for innovative AI platform.",
    type: "ReceptoNet",
    time: "Found 1 hour ago",
    score: 92,
    creditCost: 2,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  {
    id: 2,
    name: "Global Retail Hub",
    location: "London, UK",
    description: "Looking for marketing agency to scale operations.",
    type: "ReceptoNet",
    time: "Found 3 hours ago",
    score: 78,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  {
    id: 3,
    name: "Jennifer Markus",
    location: "Mumbai, India",
    description: "A team from Acme Corp is seeking a highly motivated Business Development Executive.",
    type: "OrgNetwork",
    source: "Orgs Network",
    time: "Today",
    groupName: "Sales Q2",
    people: ["u2", "u3"],
    score: 74,
    creditCost: 0,
    isUnlocked: true,
    assignedTo: "u2",
    likeStatus: "liked",
  },
  {
    id: 4,
    name: "Innovate Solutions",
    location: "Berlin, Germany",
    description: "Exploring partnership opportunities in the renewable energy sector.",
    type: "OrgNetwork",
    source: "Partner Web",
    time: "Yesterday",
    groupName: "BizDev",
    people: ["u3"],
    score: 65,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  {
    id: 5,
    name: "Michael Chen",
    location: "Singapore",
    description: "Individual looking for SaaS solutions for project management.",
    type: "OrgNetwork",
    source: "LinkedIn",
    time: "Today",
    groupName: "Productivity Tools",
    people: ["u2"],
    score: 88,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
];

const initialOrgState: OrganizationState = {
  orgName: "Default Corp",
  users: initialMockUsers,
  leads: initialMockLeads,
  credits: 100,
};

const LOCAL_STORAGE_KEY = "receptoOrgData";

const loadOrgData = (): OrganizationState => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return savedData ? JSON.parse(savedData) : initialOrgState;
};

const saveOrgData = (state: OrganizationState) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const OptimizedAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orgState, setOrgState] = useState<OrganizationState>(loadOrgData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    saveOrgData(orgState);
  }, [orgState]);

  const login = useCallback((username: string): boolean => {
    const user = orgState.users.find(
      (u) => u.name === username && u.role !== "Removed"
    );
    if (user) {
      setCurrentUser(user);
      console.log(`Logged in as ${user.name}`);
      return true;
    }
    return false;
  }, [orgState.users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateLead = useCallback((updatedLead: Lead) => {
    setOrgState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead
      ),
    }));
  }, []);

  const unlockLead = useCallback((leadId: number): boolean => {
    const lead = orgState.leads.find((l) => l.id === leadId);
    if (!lead || lead.isUnlocked || orgState.credits < lead.creditCost) {
      return false;
    }

    setOrgState((prev) => ({
      ...prev,
      credits: prev.credits - lead.creditCost,
      leads: prev.leads.map((l) =>
        l.id === leadId ? { ...l, isUnlocked: true } : l
      ),
    }));
    return true;
  }, [orgState.leads, orgState.credits]);

  const assignLead = useCallback((leadId: number, userId: string) => {
    setOrgState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === leadId ? { ...lead, assignedTo: userId } : lead
      ),
      users: prev.users.map((user) =>
        user.id === userId
          ? { ...user, assignedLeadsCount: (user.assignedLeadsCount || 0) + 1 }
          : user
      ),
    }));
  }, []);

  const likeLead = useCallback((leadId: number) => {
    setOrgState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === leadId ? { ...lead, likeStatus: "liked" } : lead
      ),
    }));
  }, []);

  const dislikeLead = useCallback((leadId: number) => {
    setOrgState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === leadId ? { ...lead, likeStatus: "disliked" } : lead
      ),
    }));
  }, []);

  const updateUserRole = useCallback((userId: string, newRole: UserRole) => {
    setOrgState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      ),
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      ...orgState,
      currentUser,
      login,
      logout,
      updateLead,
      unlockLead,
      assignLead,
      likeLead,
      dislikeLead,
      updateUserRole,
    }),
    [
      orgState,
      currentUser,
      login,
      logout,
      updateLead,
      unlockLead,
      assignLead,
      likeLead,
      dislikeLead,
      updateUserRole,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useOptimizedAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useOptimizedAppContext must be used within an OptimizedAppProvider");
  }
  return context;
}; 