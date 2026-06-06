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
      {
        title: T('Rede e roteamento', 'Network & routing', 'Red y enrutamiento', 'Netzwerk & Routing', 'Réseau et routage'),
        items: [
          { cmd: 'ip a', d: T('Mostra interfaces e endereços IP', 'Show interfaces and IP addresses', 'Muestra interfaces y direcciones IP', 'Schnittstellen und IP-Adressen anzeigen', 'Afficher les interfaces et adresses IP') },
          { cmd: 'ip route', d: T('Mostra a tabela de roteamento', 'Show the routing table', 'Muestra la tabla de enrutamiento', 'Routing-Tabelle anzeigen', 'Afficher la table de routage') },
          { cmd: 'ip route | grep default', d: T('Mostra o gateway padrão', 'Show the default gateway', 'Muestra la puerta de enlace predeterminada', 'Standard-Gateway anzeigen', 'Afficher la passerelle par défaut') },
          { cmd: 'ip route add 10.0.0.0/24 via 192.168.1.1', d: T('Adiciona uma rota estática', 'Add a static route', 'Añade una ruta estática', 'Statische Route hinzufügen', 'Ajouter une route statique') },
          { cmd: 'ip route get 1.1.1.1', d: T('Mostra a rota/interface usada para um destino', 'Show the route/interface used for a destination', 'Muestra la ruta/interfaz usada para un destino', 'Route/Schnittstelle für ein Ziel anzeigen', 'Afficher la route/interface utilisée pour une destination') },
          { cmd: 'ss -tulpn', d: T('Lista portas em escuta (TCP/UDP) e processos', 'List listening ports (TCP/UDP) and processes', 'Lista puertos en escucha (TCP/UDP) y procesos', 'Offene Ports (TCP/UDP) und Prozesse anzeigen', 'Lister les ports en écoute (TCP/UDP) et les processus') },
          { cmd: 'ping -c 4 1.1.1.1', d: T('Testa conectividade (4 pacotes)', 'Test connectivity (4 packets)', 'Prueba conectividad (4 paquetes)', 'Konnektivität testen (4 Pakete)', 'Tester la connectivité (4 paquets)') },
          { cmd: 'traceroute exemplo.com', d: T('Traça os saltos até o host', 'Trace the hops to the host', 'Traza los saltos hasta el host', 'Hops zum Host verfolgen', 'Tracer les sauts jusqu’à l’hôte') },
          { cmd: 'dig +short exemplo.com', d: T('Resolve um nome via DNS', 'Resolve a name via DNS', 'Resuelve un nombre por DNS', 'Einen Namen per DNS auflösen', 'Résoudre un nom via DNS') },
          { cmd: 'curl -I https://exemplo.com', d: T('Mostra apenas os cabeçalhos HTTP', 'Show only the HTTP headers', 'Muestra solo las cabeceras HTTP', 'Nur die HTTP-Header anzeigen', 'Afficher uniquement les en-têtes HTTP') },
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
      {
        title: T('Namespaces e uso de recursos', 'Namespaces & resource usage', 'Namespaces y uso de recursos', 'Namespaces & Ressourcennutzung', 'Namespaces et utilisation des ressources'),
        items: [
          { cmd: 'kubectl get ns', d: T('Lista os namespaces', 'List namespaces', 'Lista los namespaces', 'Namespaces auflisten', 'Lister les namespaces') },
          { cmd: 'kubectl create namespace nome', d: T('Cria um namespace', 'Create a namespace', 'Crea un namespace', 'Namespace erstellen', 'Créer un namespace') },
          { cmd: 'kubectl get all -n nome', d: T('Lista todos os recursos do namespace', 'List all resources in the namespace', 'Lista todos los recursos del namespace', 'Alle Ressourcen des Namespace auflisten', 'Lister toutes les ressources du namespace') },
          { cmd: 'kubectl config set-context --current --namespace=nome', d: T('Define o namespace padrão do contexto', 'Set the default namespace for the context', 'Define el namespace por defecto del contexto', 'Standard-Namespace des Kontexts festlegen', 'Définir le namespace par défaut du contexte') },
          { cmd: 'kubectl delete namespace nome', d: T('Remove um namespace e tudo nele', 'Delete a namespace and everything in it', 'Elimina un namespace y todo su contenido', 'Namespace und alles darin löschen', 'Supprimer un namespace et tout son contenu') },
          { cmd: 'kubectl top pods -n nome', d: T('Uso de CPU e memória por pod', 'CPU and memory usage per pod', 'Uso de CPU y memoria por pod', 'CPU- und Speicherauslastung pro Pod', 'Utilisation CPU et mémoire par pod') },
          { cmd: 'kubectl top nodes', d: T('Uso de CPU e memória por nó', 'CPU and memory usage per node', 'Uso de CPU y memoria por nodo', 'CPU- und Speicherauslastung pro Knoten', 'Utilisation CPU et mémoire par nœud') },
        ],
      },
    ],
  },
  ffmpeg: {
    id: 'ffmpeg',
    sections: [
      {
        title: T('Conversão de vídeo', 'Video conversion', 'Conversión de vídeo', 'Videokonvertierung', 'Conversion vidéo'),
        items: [
          { cmd: 'ffmpeg -i entrada.mov saida.mp4', d: T('Converte o formato/contêiner do vídeo', 'Convert video format/container', 'Convierte el formato/contenedor del vídeo', 'Videoformat/-container konvertieren', 'Convertir le format/conteneur de la vidéo') },
          { cmd: 'ffmpeg -i in.mp4 -c:v libx264 -crf 23 out.mp4', d: T('Recodifica em H.264 (CRF menor = melhor qualidade)', 'Re-encode to H.264 (lower CRF = better quality)', 'Recodifica a H.264 (CRF menor = mejor calidad)', 'In H.264 umkodieren (niedrigerer CRF = bessere Qualität)', 'Réencoder en H.264 (CRF plus bas = meilleure qualité)') },
          { cmd: 'ffmpeg -i in.mp4 -vf scale=1280:-2 out.mp4', d: T('Redimensiona para 1280px de largura mantendo a proporção', 'Resize to 1280px width keeping aspect ratio', 'Redimensiona a 1280px de ancho manteniendo la proporción', 'Auf 1280px Breite skalieren, Seitenverhältnis beibehalten', 'Redimensionner à 1280px de large en gardant le ratio') },
          { cmd: 'ffmpeg -i in.mp4 -ss 00:00:10 -t 15 corte.mp4', d: T('Recorta 15s a partir de 0:10', 'Cut 15s starting at 0:10', 'Recorta 15s a partir de 0:10', '15s ab 0:10 ausschneiden', 'Découper 15s à partir de 0:10') },
          { cmd: 'ffmpeg -i in.mp4 -vf fps=12,scale=480:-1 out.gif', d: T('Converte vídeo em GIF', 'Convert video to GIF', 'Convierte vídeo a GIF', 'Video in GIF umwandeln', 'Convertir une vidéo en GIF') },
        ],
      },
      {
        title: T('Áudio e imagens', 'Audio & images', 'Audio e imágenes', 'Audio & Bilder', 'Audio et images'),
        items: [
          { cmd: 'ffmpeg -i in.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3', d: T('Extrai o áudio para MP3 (192 kbps)', 'Extract audio to MP3 (192 kbps)', 'Extrae el audio a MP3 (192 kbps)', 'Audio als MP3 extrahieren (192 kbps)', 'Extraire l’audio en MP3 (192 kbps)') },
          { cmd: 'ffmpeg -i in.wav out.flac', d: T('Converte WAV em FLAC', 'Convert WAV to FLAC', 'Convierte WAV a FLAC', 'WAV in FLAC konvertieren', 'Convertir WAV en FLAC') },
          { cmd: 'ffmpeg -i in.mp4 -an -c:v copy mudo.mp4', d: T('Remove o áudio sem recodificar o vídeo', 'Remove audio without re-encoding video', 'Quita el audio sin recodificar el vídeo', 'Audio entfernen ohne Video neu zu kodieren', 'Supprimer l’audio sans réencoder la vidéo') },
          { cmd: 'ffmpeg -i in.mp4 -r 1 frame_%04d.png', d: T('Extrai 1 quadro por segundo como PNG', 'Extract 1 frame per second as PNG', 'Extrae 1 fotograma por segundo como PNG', '1 Bild pro Sekunde als PNG extrahieren', 'Extraire 1 image par seconde en PNG') },
        ],
      },
    ],
  },
  magick: {
    id: 'magick',
    sections: [
      {
        title: T('Conversão e redimensionamento', 'Convert & resize', 'Conversión y redimensionado', 'Konvertieren & skalieren', 'Conversion et redimensionnement'),
        items: [
          { cmd: 'magick entrada.png saida.jpg', d: T('Converte o formato da imagem', 'Convert image format', 'Convierte el formato de la imagen', 'Bildformat konvertieren', 'Convertir le format de l’image') },
          { cmd: 'magick in.jpg -resize 50% out.jpg', d: T('Redimensiona para 50% do tamanho', 'Resize to 50% of the size', 'Redimensiona al 50% del tamaño', 'Auf 50% der Größe skalieren', 'Redimensionner à 50% de la taille') },
          { cmd: 'magick in.jpg -resize 800x600 out.jpg', d: T('Redimensiona para caber em 800x600', 'Resize to fit within 800x600', 'Redimensiona para caber en 800x600', 'Auf 800x600 anpassen', 'Redimensionner pour tenir dans 800x600') },
          { cmd: 'magick in.jpg -strip -quality 80 out.jpg', d: T('Remove metadados e ajusta a qualidade (web)', 'Strip metadata and set quality (web)', 'Elimina metadatos y ajusta la calidad (web)', 'Metadaten entfernen und Qualität setzen (Web)', 'Supprimer les métadonnées et régler la qualité (web)') },
          { cmd: 'magick *.png saida.pdf', d: T('Combina várias imagens em um PDF', 'Combine several images into a PDF', 'Combina varias imágenes en un PDF', 'Mehrere Bilder zu einem PDF zusammenführen', 'Combiner plusieurs images en un PDF') },
        ],
      },
      {
        title: T('Edição', 'Editing', 'Edición', 'Bearbeitung', 'Édition'),
        items: [
          { cmd: 'magick in.jpg -rotate 90 out.jpg', d: T('Rotaciona a imagem em 90°', 'Rotate the image by 90°', 'Rota la imagen 90°', 'Bild um 90° drehen', 'Pivoter l’image de 90°') },
          { cmd: 'magick in.jpg -crop 100x100+10+10 out.jpg', d: T('Recorta 100x100 a partir de (10,10)', 'Crop 100x100 starting at (10,10)', 'Recorta 100x100 desde (10,10)', '100x100 ab (10,10) zuschneiden', 'Rogner 100x100 à partir de (10,10)') },
          { cmd: 'magick in.png -background white -flatten out.jpg', d: T('Achata a transparência sobre fundo branco', 'Flatten transparency onto a white background', 'Aplana la transparencia sobre fondo blanco', 'Transparenz auf weißem Hintergrund zusammenführen', 'Aplatir la transparence sur fond blanc') },
          { cmd: 'magick identify in.jpg', d: T('Mostra formato, dimensões e detalhes', 'Show format, dimensions and details', 'Muestra formato, dimensiones y detalles', 'Format, Abmessungen und Details anzeigen', 'Afficher format, dimensions et détails') },
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
