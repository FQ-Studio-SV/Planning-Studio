/**
 * Jira API Types and Interfaces
 * 
 * Definiciones de tipos TypeScript para las respuestas de la API de Jira
 */

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  lead: JiraUser;
}

export interface JiraIssueType {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  subtask: boolean;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    issuetype: JiraIssueType;
    project: JiraProject;
    assignee?: JiraUser;
    reporter: JiraUser;
    status: {
      name: string;
      statusCategory: {
        name: string;
      };
    };
    priority: {
      name: string;
    };
    created: string;
    updated: string;
    // Campos personalizados - usar Record para flexibilidad
    [key: string]: any;
  };
}

export interface CreateIssueRequest {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
    assignee?: {
      accountId: string;
    };
    customfield_10016?: number; // Story points
  };
}

export interface JiraApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    id: string;
    name: string;
  };
}

export interface JiraComment {
  id: string;
  body: string;
  author: JiraUser;
  created: string;
  updated: string;
}
