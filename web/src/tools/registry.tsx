import type { ComponentType, ReactNode } from 'react';
import type { SvgIconProps } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import KeyIcon from '@mui/icons-material/Key';
import TransformIcon from '@mui/icons-material/Transform';
import LinkIcon from '@mui/icons-material/Link';
import TagIcon from '@mui/icons-material/Tag';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ContrastIcon from '@mui/icons-material/Contrast';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import RouteIcon from '@mui/icons-material/Route';
import DnsIcon from '@mui/icons-material/Dns';
import HttpIcon from '@mui/icons-material/Http';

import BaseConverter from './BaseConverter';
import JwtDecoder from './JwtDecoder';
import EncoderTool, { base64Encode, base64Decode } from './EncoderTool';
import HashTool from './HashTool';
import UuidTool from './UuidTool';
import TimestampTool from './TimestampTool';
import JsonTool from './JsonTool';
import ContrastChecker from './ContrastChecker';
import NetworkTool from './NetworkTool';
import HttpInspector from './HttpInspector';

export type ToolGroup = 'converters' | 'network' | 'accessibility';

export type ToolDef = {
  id: string;
  group: ToolGroup;
  icon: ComponentType<SvgIconProps>;
  render: () => ReactNode;
};

export const TOOLS: ToolDef[] = [
  { id: 'base-converter', group: 'converters', icon: CalculateIcon, render: () => <BaseConverter /> },
  { id: 'jwt', group: 'converters', icon: KeyIcon, render: () => <JwtDecoder /> },
  {
    id: 'base64',
    group: 'converters',
    icon: TransformIcon,
    render: () => <EncoderTool i18nKey="base64" encode={base64Encode} decode={base64Decode} />,
  },
  {
    id: 'url',
    group: 'converters',
    icon: LinkIcon,
    render: () => <EncoderTool i18nKey="url" encode={encodeURIComponent} decode={decodeURIComponent} />,
  },
  { id: 'hash', group: 'converters', icon: TagIcon, render: () => <HashTool /> },
  { id: 'uuid', group: 'converters', icon: FingerprintIcon, render: () => <UuidTool /> },
  { id: 'timestamp', group: 'converters', icon: ScheduleIcon, render: () => <TimestampTool /> },
  { id: 'json', group: 'converters', icon: DataObjectIcon, render: () => <JsonTool /> },
  { id: 'contrast', group: 'accessibility', icon: ContrastIcon, render: () => <ContrastChecker /> },
  { id: 'whois', group: 'network', icon: TravelExploreIcon, render: () => <NetworkTool endpoint="whois" /> },
  { id: 'ping', group: 'network', icon: NetworkPingIcon, render: () => <NetworkTool endpoint="ping" /> },
  { id: 'traceroute', group: 'network', icon: RouteIcon, render: () => <NetworkTool endpoint="traceroute" /> },
  { id: 'dns', group: 'network', icon: DnsIcon, render: () => <NetworkTool endpoint="dns" withDnsType /> },
  { id: 'http', group: 'network', icon: HttpIcon, render: () => <HttpInspector /> },
];

export const TOOL_GROUPS: ToolGroup[] = ['converters', 'network', 'accessibility'];

export const getTool = (id?: string) => TOOLS.find((t) => t.id === id);
