// Reference cheat sheets. Command syntax is language-neutral; only the short
// description is translated. Keyed by the same language codes as i18n.
export type Lang = 'pt-BR' | 'en-US' | 'es' | 'de' | 'fr';

export type CheatItem = { cmd: string; d: Record<Lang, string> };
export type CheatSection = { title: Record<Lang, string>; items: CheatItem[] };
export type CheatSheet = { id: string; sections: CheatSection[] };

const T = (pt: string, en: string, es: string, de: string, fr: string): Record<Lang, string> => ({
  'pt-BR': pt,
  'en-US': en,
  es,
  de,
  fr,
});

export const CHEAT_SHEETS: Record<string, CheatSheet> = {
  linux: {
    id: 'linux',
    sections: [
      {
        title: T('Arquivos e diretórios', 'Files & directories', 'Archivos y directorios', 'Dateien & Verzeichnisse', 'Fichiers et répertoires'),
        items: [
          { cmd: 'ls -la', d: T('Lista arquivos (inclui ocultos) com detalhes', 'List files (incl. hidden) with details', 'Lista archivos (incl. ocultos) con detalles', 'Dateien auflisten (inkl. versteckte) mit Details', 'Lister les fichiers (cachés inclus) en détail') },
          { cmd: 'cd /caminho', d: T('Muda de diretório', 'Change directory', 'Cambia de directorio', 'Verzeichnis wechseln', 'Changer de répertoire') },
          { cmd: 'pwd', d: T('Mostra o diretório atual', 'Print working directory', 'Muestra el directorio actual', 'Aktuelles Verzeichnis anzeigen', 'Afficher le répertoire courant') },
          { cmd: 'cp -r origem destino', d: T('Copia recursivamente', 'Copy recursively', 'Copia recursivamente', 'Rekursiv kopieren', 'Copier récursivement') },
          { cmd: 'mv origem destino', d: T('Move ou renomeia', 'Move or rename', 'Mueve o renombra', 'Verschieben oder umbenennen', 'Déplacer ou renommer') },
          { cmd: 'rm -rf dir', d: T('Remove recursivamente (cuidado!)', 'Remove recursively (be careful!)', 'Elimina recursivamente (¡cuidado!)', 'Rekursiv löschen (Vorsicht!)', 'Supprimer récursivement (attention !)') },
          { cmd: 'tar -czf a.tgz dir', d: T('Compacta em .tar.gz (-xzf extrai)', 'Compress to .tar.gz (-xzf extracts)', 'Comprime a .tar.gz (-xzf extrae)', 'Nach .tar.gz packen (-xzf entpackt)', 'Compresser en .tar.gz (-xzf extrait)') },
        ],
      },
      {
        title: T('Busca, permissões e processos', 'Search, permissions & processes', 'Búsqueda, permisos y procesos', 'Suche, Rechte & Prozesse', 'Recherche, droits et processus'),
        items: [
          { cmd: 'grep -r "texto" .', d: T('Busca texto recursivamente', 'Search text recursively', 'Busca texto recursivamente', 'Text rekursiv suchen', 'Rechercher du texte récursivement') },
          { cmd: 'find . -name "*.log"', d: T('Encontra arquivos por nome', 'Find files by name', 'Encuentra archivos por nombre', 'Dateien nach Namen finden', 'Trouver des fichiers par nom') },
          { cmd: 'chmod 755 arquivo', d: T('Altera permissões', 'Change permissions', 'Cambia permisos', 'Rechte ändern', 'Modifier les droits') },
          { cmd: 'chown user:grupo arquivo', d: T('Altera o dono/grupo', 'Change owner/group', 'Cambia propietario/grupo', 'Eigentümer/Gruppe ändern', 'Changer propriétaire/groupe') },
          { cmd: 'ps aux | grep nome', d: T('Lista processos em execução', 'List running processes', 'Lista procesos en ejecución', 'Laufende Prozesse auflisten', 'Lister les processus actifs') },
          { cmd: 'df -h && du -sh dir', d: T('Uso de disco / tamanho do diretório', 'Disk usage / directory size', 'Uso de disco / tamaño de directorio', 'Speicherplatz / Verzeichnisgröße', 'Espace disque / taille du répertoire') },
          { cmd: 'tail -f arquivo.log', d: T('Acompanha um log em tempo real', 'Follow a log in real time', 'Sigue un log en tiempo real', 'Log in Echtzeit verfolgen', 'Suivre un journal en temps réel') },
        ],
      },
    ],
  },
  docker: {
    id: 'docker',
    sections: [
      {
        title: T('Containers e imagens', 'Containers & images', 'Contenedores e imágenes', 'Container & Images', 'Conteneurs et images'),
        items: [
          { cmd: 'docker ps -a', d: T('Lista containers (todos)', 'List containers (all)', 'Lista contenedores (todos)', 'Container auflisten (alle)', 'Lister les conteneurs (tous)') },
          { cmd: 'docker images', d: T('Lista imagens locais', 'List local images', 'Lista imágenes locales', 'Lokale Images auflisten', 'Lister les images locales') },
          { cmd: 'docker build -t nome:tag .', d: T('Constrói uma imagem', 'Build an image', 'Construye una imagen', 'Image bauen', 'Construire une image') },
          { cmd: 'docker run -d -p 80:80 nome', d: T('Executa em background com porta', 'Run detached with port mapping', 'Ejecuta en segundo plano con puerto', 'Im Hintergrund mit Port starten', 'Lancer en arrière-plan avec port') },
          { cmd: 'docker exec -it id sh', d: T('Abre um shell no container', 'Open a shell in the container', 'Abre una shell en el contenedor', 'Shell im Container öffnen', 'Ouvrir un shell dans le conteneur') },
          { cmd: 'docker logs -f id', d: T('Acompanha os logs', 'Follow the logs', 'Sigue los logs', 'Logs verfolgen', 'Suivre les journaux') },
        ],
      },
      {
        title: T('Ciclo de vida e limpeza', 'Lifecycle & cleanup', 'Ciclo de vida y limpieza', 'Lebenszyklus & Aufräumen', 'Cycle de vie et nettoyage'),
        items: [
          { cmd: 'docker stop id && docker start id', d: T('Para e inicia um container', 'Stop and start a container', 'Detiene e inicia un contenedor', 'Container stoppen und starten', 'Arrêter et démarrer un conteneur') },
          { cmd: 'docker rm id && docker rmi img', d: T('Remove container e imagem', 'Remove container and image', 'Elimina contenedor e imagen', 'Container und Image entfernen', 'Supprimer conteneur et image') },
          { cmd: 'docker pull/push nome:tag', d: T('Baixa/envia imagem do registry', 'Pull/push image from registry', 'Descarga/sube imagen del registry', 'Image vom Registry holen/senden', 'Récupérer/envoyer une image du registre') },
          { cmd: 'docker compose up -d', d: T('Sobe a stack do compose', 'Start the compose stack', 'Levanta la stack de compose', 'Compose-Stack starten', 'Démarrer la stack compose') },
          { cmd: 'docker system prune -a', d: T('Limpa recursos não usados', 'Clean unused resources', 'Limpia recursos no usados', 'Ungenutzte Ressourcen aufräumen', 'Nettoyer les ressources inutilisées') },
          { cmd: 'docker inspect id', d: T('Mostra detalhes em JSON', 'Show details as JSON', 'Muestra detalles en JSON', 'Details als JSON anzeigen', 'Afficher les détails en JSON') },
        ],
      },
    ],
  },
  kubernetes: {
    id: 'kubernetes',
    sections: [
      {
        title: T('Inspeção de recursos', 'Resource inspection', 'Inspección de recursos', 'Ressourcen prüfen', 'Inspection des ressources'),
        items: [
          { cmd: 'kubectl get pods -A', d: T('Lista pods de todos os namespaces', 'List pods in all namespaces', 'Lista pods de todos los namespaces', 'Pods aller Namespaces auflisten', 'Lister les pods de tous les namespaces') },
          { cmd: 'kubectl get svc,deploy -n ns', d: T('Lista serviços e deployments', 'List services and deployments', 'Lista servicios y deployments', 'Services und Deployments auflisten', 'Lister services et deployments') },
          { cmd: 'kubectl describe pod nome', d: T('Detalhes e eventos do pod', 'Pod details and events', 'Detalles y eventos del pod', 'Pod-Details und Ereignisse', 'Détails et événements du pod') },
          { cmd: 'kubectl logs -f pod', d: T('Acompanha os logs do pod', 'Follow the pod logs', 'Sigue los logs del pod', 'Pod-Logs verfolgen', 'Suivre les journaux du pod') },
          { cmd: 'kubectl exec -it pod -- sh', d: T('Abre um shell no pod', 'Open a shell in the pod', 'Abre una shell en el pod', 'Shell im Pod öffnen', 'Ouvrir un shell dans le pod') },
          { cmd: 'kubectl get events --sort-by=.lastTimestamp', d: T('Eventos recentes do cluster', 'Recent cluster events', 'Eventos recientes del clúster', 'Aktuelle Cluster-Ereignisse', 'Événements récents du cluster') },
        ],
      },
      {
        title: T('Deploy e operação', 'Deploy & operations', 'Despliegue y operación', 'Deploy & Betrieb', 'Déploiement et opérations'),
        items: [
          { cmd: 'kubectl apply -f arquivo.yaml', d: T('Aplica um manifesto', 'Apply a manifest', 'Aplica un manifiesto', 'Manifest anwenden', 'Appliquer un manifeste') },
          { cmd: 'kubectl delete -f arquivo.yaml', d: T('Remove recursos do manifesto', 'Delete resources from manifest', 'Elimina recursos del manifiesto', 'Ressourcen aus Manifest löschen', 'Supprimer les ressources du manifeste') },
          { cmd: 'kubectl rollout status deploy/nome', d: T('Acompanha o rollout', 'Watch the rollout', 'Sigue el rollout', 'Rollout beobachten', 'Suivre le déploiement') },
          { cmd: 'kubectl scale deploy/nome --replicas=3', d: T('Ajusta o número de réplicas', 'Scale the replica count', 'Ajusta el número de réplicas', 'Replikaanzahl skalieren', 'Ajuster le nombre de réplicas') },
          { cmd: 'kubectl port-forward svc/nome 8080:80', d: T('Encaminha uma porta local', 'Forward a local port', 'Reenvía un puerto local', 'Lokalen Port weiterleiten', 'Rediriger un port local') },
          { cmd: 'kubectl config use-context nome', d: T('Troca o contexto/cluster', 'Switch context/cluster', 'Cambia de contexto/clúster', 'Kontext/Cluster wechseln', 'Changer de contexte/cluster') },
        ],
      },
    ],
  },
};

const FALLBACK: Lang[] = ['en-US', 'pt-BR'];

export function descFor(item: CheatItem, lang: string): string {
  return item.d[lang as Lang] ?? item.d[FALLBACK.find((l) => item.d[l]) as Lang] ?? '';
}
export function titleFor(section: CheatSection, lang: string): string {
  return section.title[lang as Lang] ?? section.title[FALLBACK.find((l) => section.title[l]) as Lang] ?? '';
}

/** Flattened, lower-cased text of a sheet for the global tool search. */
export function cheatSearchText(id: string, lang: string): string {
  const sheet = CHEAT_SHEETS[id];
  if (!sheet) return '';
  const parts: string[] = [];
  for (const s of sheet.sections) {
    parts.push(titleFor(s, lang));
    for (const it of s.items) parts.push(it.cmd, descFor(it, lang));
  }
  return parts.join(' ').toLowerCase();
}
