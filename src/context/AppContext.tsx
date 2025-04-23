import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { Location } from "../components/common/optimizedFilterUtils";
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "Admin" | "Member" | "Removed";
  lastActive: string;
  generated?: number;
  unlocked?: number;
  assignedLeadsCount?: number;
}

export interface Lead {
  id: number;
  name: string;
  location: Location;
  description: string;
  type: "ReceptoNet" | "OrgNetwork";
  source?: string;
  time: string;
  groupName?: string;
  people?: string[];
  score?: number | null;
  creditCost: number;
  isUnlocked: boolean;
  assignedTo?: string | null;
  likeStatus?: "liked" | "disliked" | null;
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
  updateUserRole: (userId: string, newRole: User["role"]) => void;
}

const initialMockUsers: User[] = [
  {
    id: "u1",
    name: "Sarah Chen",
    avatar: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?w=1380",
    role: "Admin",
    lastActive: "Now",
    generated: 12,
    unlocked: 10,
    assignedLeadsCount: 5,
  },
  {
    id: "u2",
    name: "Marcus Rodriguez",
    avatar: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?w=1380",
    role: "Member",
    lastActive: "2 min ago",
    generated: 123,
    unlocked: 123,
    assignedLeadsCount: 40,
  },
  {
    id: "u3",
    name: "Priya Patel",
    avatar: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?w=1380",
    role: "Member",
    lastActive: "1 hr ago",
    generated: 56,
    unlocked: 56,
    assignedLeadsCount: 15,
  },
  {
    id: "u4",
    name: "James Wilson",
    avatar: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?w=1380",
    role: "Removed",
    lastActive: "Yesterday",
    generated: 23,
    unlocked: 23,
    assignedLeadsCount: 25,
  },
];

const initialMockLeads: Lead[] = [
  // ReceptoNet Leads
  {
    id: 1,
    name: "Nexus AI Solutions",
    location: "san_francisco_usa",
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
    location: "london_uk",
    description: "Looking for marketing agency to scale operations.",
    type: "ReceptoNet",
    time: "Found 3 hours ago",
    score: 78,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  // OrgNetwork Leads
  {
    id: 3,
    name: "Jennifer Markus",
    location: "mumbai_india",
    description:
      "A team from Acme Corp is seeking a highly motivated Business Development Executive.",
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
    location: "berlin_germany",
    description:
      "Exploring partnership opportunities in the renewable energy sector.",
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
    location: "singapore",
    description:
      "Individual looking for SaaS solutions for project management.",
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
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialOrgState));
  return initialOrgState;
};

const saveOrgData = (state: OrganizationState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orgState, setOrgState] = useState<OrganizationState>(loadOrgData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    saveOrgData(orgState);
  }, [orgState]);

  const login = useCallback(
    (username: string): boolean => {

      const user = orgState.users.find(
        (u) => u.name === username && u.role !== "Removed"
      );
      if (user) {
        setCurrentUser(user);
        console.log(`Logged in as ${user.name}`);
        return true;
      }
      return false;
    },
    [orgState.users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    console.log("Logged out");
  }, []);

  const updateLead = useCallback((updatedLead: Lead) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead
      ),
    }));
  }, []);

  const unlockLead = useCallback(
    (leadId: number): boolean => {
      const leadToUnlock = orgState.leads.find((lead) => lead.id === leadId);
      if (!leadToUnlock || leadToUnlock.isUnlocked) return false;

      if (orgState.credits < leadToUnlock.creditCost) {
        alert("Not enough credits!");
        return false;
      }

      setOrgState((prevState) => {
        const newLeads = prevState.leads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                isUnlocked: true,
              }
            : lead
        );
        return {
          ...prevState,
          leads: newLeads,
          credits: prevState.credits - leadToUnlock.creditCost,
        };
      });
      return true;
    },
    [orgState.credits, orgState.leads]
  );

  const assignLead = useCallback((leadId: number, userId: string) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === leadId ? { ...lead, assignedTo: userId } : lead
      ),
    }));

  }, []);

  const likeLead = useCallback((leadId: number) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === leadId ? { ...lead, likeStatus: "liked" } : lead
      ),
    }));
  }, []);

  const dislikeLead = useCallback((leadId: number) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === leadId ? { ...lead, likeStatus: "disliked" } : lead
      ),
    }));
  }, []);

  const updateUserRole = useCallback(
    (userId: string, newRole: User["role"]) => {
      if (userId === currentUser?.id) {
        alert("You cannot change your own role.");
        return;
      }

      setOrgState((prevState) => ({
        ...prevState,
        users: prevState.users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        ),

        leads:
          newRole === "Removed"
            ? prevState.leads.map((lead) =>
                lead.assignedTo === userId
                  ? { ...lead, assignedTo: null }
                  : lead
              )
            : prevState.leads,
      }));
    },
    [currentUser?.id]
  );

  const contextValue: AppContextType = {
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
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
