import type { ComponentType, ReactNode } from 'react';
import type { SvgIconProps } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import LanIcon from '@mui/icons-material/Lan';
import LockIcon from '@mui/icons-material/Lock';
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
import TerminalIcon from '@mui/icons-material/Terminal';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import HubIcon from '@mui/icons-material/Hub';

import BaseConverter from './BaseConverter';
import IpCalculator from './IpCalculator';
import ChmodCalculator from './ChmodCalculator';
import JwtDecoder from './JwtDecoder';
import EncoderTool, { base64Encode, base64Decode } from './EncoderTool';
import HashTool from './HashTool';
import UuidTool from './UuidTool';
import TimestampTool from './TimestampTool';
import JsonTool from './JsonTool';
import ContrastChecker from './ContrastChecker';
import NetworkTool from './NetworkTool';
import HttpInspector from './HttpInspector';
import CheatSheet from './CheatSheet';
import { cheatSearchText } from './cheatsheets';

export type ToolGroup = 'converters' | 'network' | 'reference' | 'accessibility';

export type ToolDef = {
  id: string;
  group: ToolGroup;
  icon: ComponentType<SvgIconProps>;
  render: () => ReactNode;
  /** Language-neutral extra search terms. */
  keywords?: string;
  /** Links the tool to a cheat-sheet data set (for search over its body). */
  cheatId?: string;
};

export const TOOLS: ToolDef[] = [
  { id: 'base-converter', group: 'converters', icon: CalculateIcon, keywords: '0x hex bin oct dec bitwise base radix', render: () => <BaseConverter /> },
  { id: 'ip-calculator', group: 'converters', icon: LanIcon, keywords: 'cidr subnet netmask broadcast wildcard ipv4 mask', render: () => <IpCalculator /> },
  { id: 'chmod', group: 'converters', icon: LockIcon, keywords: '777 755 644 rwx octal permissions setuid setgid sticky umask', render: () => <ChmodCalculator /> },
  { id: 'jwt', group: 'converters', icon: KeyIcon, keywords: 'json web token bearer header payload claims', render: () => <JwtDecoder /> },
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
  { id: 'contrast', group: 'accessibility', icon: ContrastIcon, keywords: 'wcag ratio luminance aa aaa color', render: () => <ContrastChecker /> },
  { id: 'whois', group: 'network', icon: TravelExploreIcon, keywords: 'domain registrar registration', render: () => <NetworkTool endpoint="whois" /> },
  { id: 'ping', group: 'network', icon: NetworkPingIcon, keywords: 'icmp latency rtt', render: () => <NetworkTool endpoint="ping" /> },
  { id: 'traceroute', group: 'network', icon: RouteIcon, keywords: 'hops route path', render: () => <NetworkTool endpoint="traceroute" /> },
  { id: 'dns', group: 'network', icon: DnsIcon, keywords: 'dig a aaaa mx txt ns cname soa caa resolve', render: () => <NetworkTool endpoint="dns" withDnsType /> },
  { id: 'http', group: 'network', icon: HttpIcon, keywords: 'curl request headers status fetch rest', render: () => <HttpInspector /> },
  { id: 'linux', group: 'reference', icon: TerminalIcon, keywords: 'shell bash ls grep chmod tar ps', cheatId: 'linux', render: () => <CheatSheet id="linux" /> },
  { id: 'docker', group: 'reference', icon: ViewInArIcon, keywords: 'container image compose build run exec', cheatId: 'docker', render: () => <CheatSheet id="docker" /> },
  { id: 'kubernetes', group: 'reference', icon: HubIcon, keywords: 'k8s kubectl pod deployment service rollout', cheatId: 'kubernetes', render: () => <CheatSheet id="kubernetes" /> },
];

export const TOOL_GROUPS: ToolGroup[] = ['converters', 'network', 'reference', 'accessibility'];

export const getTool = (id?: string) => TOOLS.find((t) => t.id === id);

/**
 * Lower-cased searchable text for a tool: translated name + description +
 * neutral keywords + (for cheat sheets) the full body content.
 */
export function toolSearchText(tool: ToolDef, lang: string, t: (k: string) => string): string {
  const parts = [t(`tools.${tool.id}.name`), t(`tools.${tool.id}.desc`), tool.keywords ?? ''];
  if (tool.cheatId) parts.push(cheatSearchText(tool.cheatId, lang));
  return parts.join(' ').toLowerCase();
}
