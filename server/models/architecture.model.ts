import mongoose, { Schema, Document } from "mongoose";
import {ArchitectureEdgeDirection,ArchitectureEdgeType,ArchitectureNodeType} from "./../types/Architecture"


export interface IArchitectureNodeData {
  label: string;
  description?: string;
  category: string;

  technology?: string;
  technologies?: string[];

  icon?: string;
  color?: string;

  properties?: Record<string, unknown>;
}

export interface IArchitectureNode {
  id: string;

  type: ArchitectureNodeType;

  position: {
    x: number;
    y: number;
  };

  data: IArchitectureNodeData;

  width?: number;
  height?: number;

  parentId?: string;
}

export interface IArchitectureEdgeData {
  protocol?: string;
  method?: string;
  dataType?: string;

  description?: string;

  direction?: ArchitectureEdgeDirection;

  properties?: Record<string, unknown>;
}

export interface IArchitectureEdge {
  id: string;

  source: string;
  target: string;

  sourceHandle?: string;
  targetHandle?: string;

  label?: string;

  type: ArchitectureEdgeType;

  animated?: boolean;

  data?: IArchitectureEdgeData;
}

export interface IArchitectureViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface IArchitecture extends Document {
  projectId: mongoose.Types.ObjectId;

  nodes: IArchitectureNode[];

  edges: IArchitectureEdge[];

  viewport: IArchitectureViewport;

  version: number;

  createdAt: Date;
  updatedAt: Date;
}

const architectureNodeDataSchema = new Schema<IArchitectureNodeData>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    technology: {
      type: String,
      default: "",
      trim: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    icon: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    properties: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const architectureNodeSchema = new Schema<IArchitectureNode>(
  {
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "api",
        "database",
        "cache",
        "queue",
        "storage",
        "service",
        "microservice",
        "auth",
        "load-balancer",
        "cdn",
        "worker",
        "container",
        "external-service",
        "ai-service",
        "custom",
      ],
      required: true,
    },

    position: {
      x: {
        type: Number,
        required: true,
        default: 0,
      },

      y: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    data: {
      type: architectureNodeDataSchema,
      required: true,
    },

    width: {
      type: Number,
      default: 220,
    },

    height: {
      type: Number,
      default: 120,
    },

    parentId: {
      type: String,
      default: undefined,
    },
  },
  {
    _id: false,
  }
);

const architectureEdgeDataSchema = new Schema<IArchitectureEdgeData>(
  {
    protocol: {
      type: String,
      default: "",
    },

    method: {
      type: String,
      default: "",
    },

    dataType: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    direction: {
      type: String,
      enum: ["request", "response", "bidirectional"],
      default: "request",
    },

    properties: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const architectureEdgeSchema = new Schema<IArchitectureEdge>(
  {
    id: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    target: {
      type: String,
      required: true,
    },

    sourceHandle: {
      type: String,
      default: undefined,
    },

    targetHandle: {
      type: String,
      default: undefined,
    },

    label: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "data-flow",
        "http",
        "websocket",
        "event",
        "message-queue",
        "database-query",
        "dependency",
        "async",
        "custom",
      ],
      required: true,
    },

    animated: {
      type: Boolean,
      default: false,
    },

    data: {
      type: architectureEdgeDataSchema,
      default: undefined,
    },
  },
  {
    _id: false,
  }
);

const architectureViewportSchema = new Schema<IArchitectureViewport>(
  {
    x: {
      type: Number,
      default: 0,
    },

    y: {
      type: Number,
      default: 0,
    },

    zoom: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const architectureSchema = new Schema<IArchitecture>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
      index: true,
    },

    nodes: {
      type: [architectureNodeSchema],
      default: [],
    },

    edges: {
      type: [architectureEdgeSchema],
      default: [],
    },

    viewport: {
      type: architectureViewportSchema,
      default: () => ({
        x: 0,
        y: 0,
        zoom: 1,
      }),
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_doc: any, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      transform: (_doc: any, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Architecture = mongoose.model<IArchitecture>(
  "Architecture",
  architectureSchema
);