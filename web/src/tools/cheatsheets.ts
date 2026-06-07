// Reference cheat sheets. Command syntax is language-neutral; only the short
// description is translated. Keyed by the same language codes as i18n.
export type Lang = 'pt-BR' | 'en-US' | 'es' | 'de' | 'fr';

export type CheatItem = { cmd: string; d: Record<Lang, string> };
export type CheatSection = { title: Record<Lang, string>; items: CheatItem[] };
export type CheatLink = { label: string; href: string };
export type CheatSheet = { id: string; sections: CheatSection[]; links?: CheatLink[] };

const T = (pt: string, en: string, es: string, de: string, fr: string): Record<Lang, string> => ({
  'pt-BR': pt,
  'en-US': en,
  es,
  de,
  fr,
});

// Neutral string: identical across all languages (e.g. platform labels).
const N = (s: string): Record<Lang, string> => ({ 'pt-BR': s, 'en-US': s, es: s, de: s, fr: s });

const INSTALL_TITLE = T('Instalação', 'Installation', 'Instalación', 'Installation', 'Installation');
const install = (winget: string, brew: string, apt: string): CheatSection => ({
  title: INSTALL_TITLE,
  items: [
    { cmd: winget, d: N('Windows (winget / PowerShell ou cmd)') },
    { cmd: brew, d: N('macOS (Homebrew)') },
    { cmd: apt, d: N('Linux (apt)') },
  ],
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
      install('winget install -e --id Docker.DockerDesktop', 'brew install --cask docker', 'sudo apt-get update && sudo apt-get install -y docker.io'),
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
      install('winget install -e --id Kubernetes.kubectl', 'brew install kubectl', 'sudo snap install kubectl --classic'),
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
      install('winget install -e --id Gyan.FFmpeg', 'brew install ffmpeg', 'sudo apt-get install -y ffmpeg'),
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
      install('winget install -e --id ImageMagick.ImageMagick', 'brew install imagemagick', 'sudo apt-get install -y imagemagick'),
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
  pkg: {
    id: 'pkg',
    links: [
      { label: 'brew.sh', href: 'https://docs.brew.sh' },
      { label: 'apt (Debian)', href: 'https://wiki.debian.org/apt' },
      { label: 'winget', href: 'https://learn.microsoft.com/windows/package-manager/winget/' },
    ],
    sections: [
      {
        title: T('Homebrew (macOS/Linux)', 'Homebrew (macOS/Linux)', 'Homebrew (macOS/Linux)', 'Homebrew (macOS/Linux)', 'Homebrew (macOS/Linux)'),
        items: [
          { cmd: 'brew install pacote', d: T('Instala um pacote', 'Install a package', 'Instala un paquete', 'Ein Paket installieren', 'Installer un paquet') },
          { cmd: 'brew update && brew upgrade', d: T('Atualiza o índice e os pacotes', 'Update the index and packages', 'Actualiza el índice y los paquetes', 'Index und Pakete aktualisieren', 'Mettre à jour l’index et les paquets') },
          { cmd: 'brew search termo', d: T('Procura por pacotes', 'Search for packages', 'Busca paquetes', 'Nach Paketen suchen', 'Rechercher des paquets') },
          { cmd: 'brew uninstall pacote', d: T('Remove um pacote', 'Remove a package', 'Elimina un paquete', 'Ein Paket entfernen', 'Supprimer un paquet') },
        ],
      },
      {
        title: T('apt (Debian/Ubuntu)', 'apt (Debian/Ubuntu)', 'apt (Debian/Ubuntu)', 'apt (Debian/Ubuntu)', 'apt (Debian/Ubuntu)'),
        items: [
          { cmd: 'sudo apt-get update', d: T('Atualiza a lista de pacotes', 'Update the package list', 'Actualiza la lista de paquetes', 'Paketliste aktualisieren', 'Mettre à jour la liste des paquets') },
          { cmd: 'sudo apt-get install -y pacote', d: T('Instala um pacote', 'Install a package', 'Instala un paquete', 'Ein Paket installieren', 'Installer un paquet') },
          { cmd: 'sudo apt-get upgrade -y', d: T('Atualiza os pacotes instalados', 'Upgrade installed packages', 'Actualiza los paquetes instalados', 'Installierte Pakete aktualisieren', 'Mettre à niveau les paquets installés') },
          { cmd: 'apt-cache search termo', d: T('Procura por pacotes', 'Search for packages', 'Busca paquetes', 'Nach Paketen suchen', 'Rechercher des paquets') },
        ],
      },
      {
        title: T('winget (Windows)', 'winget (Windows)', 'winget (Windows)', 'winget (Windows)', 'winget (Windows)'),
        items: [
          { cmd: 'winget install -e --id Editor.Id', d: T('Instala um pacote pelo ID', 'Install a package by ID', 'Instala un paquete por ID', 'Ein Paket per ID installieren', 'Installer un paquet par ID') },
          { cmd: 'winget search termo', d: T('Procura por pacotes', 'Search for packages', 'Busca paquetes', 'Nach Paketen suchen', 'Rechercher des paquets') },
          { cmd: 'winget upgrade --all', d: T('Atualiza tudo que estiver desatualizado', 'Upgrade everything outdated', 'Actualiza todo lo desactualizado', 'Alles Veraltete aktualisieren', 'Mettre à jour tout ce qui est obsolète') },
          { cmd: 'winget uninstall --id Editor.Id', d: T('Remove um pacote', 'Remove a package', 'Elimina un paquete', 'Ein Paket entfernen', 'Supprimer un paquet') },
        ],
      },
    ],
  },
  powershell: {
    id: 'powershell',
    sections: [
      {
        title: T('Básico', 'Basic', 'Básico', 'Grundlagen', 'Basique'),
        items: [
          { cmd: 'Get-ChildItem -Force', d: T('Lista arquivos (inclui ocultos)', 'List files (incl. hidden)', 'Lista archivos (incl. ocultos)', 'Dateien auflisten (inkl. versteckte)', 'Lister les fichiers (cachés inclus)') },
          { cmd: 'Set-Location C:\\caminho', d: T('Muda de diretório', 'Change directory', 'Cambia de directorio', 'Verzeichnis wechseln', 'Changer de répertoire') },
          { cmd: 'Get-Content arquivo.log -Tail 20', d: T('Mostra as últimas linhas de um arquivo', 'Show the last lines of a file', 'Muestra las últimas líneas de un archivo', 'Letzte Zeilen einer Datei anzeigen', 'Afficher les dernières lignes d’un fichier') },
          { cmd: 'Copy-Item a.txt b.txt', d: T('Copia um arquivo', 'Copy a file', 'Copia un archivo', 'Eine Datei kopieren', 'Copier un fichier') },
        ],
      },
      {
        title: T('Intermediário', 'Intermediate', 'Intermedio', 'Mittel', 'Intermédiaire'),
        items: [
          { cmd: "Get-Process | Where-Object CPU -gt 100", d: T('Filtra objetos por uma condição', 'Filter objects by a condition', 'Filtra objetos por una condición', 'Objekte nach Bedingung filtern', 'Filtrer les objets par une condition') },
          { cmd: "Get-Service | Sort-Object Status | Select-Object -First 10", d: T('Ordena e seleciona resultados', 'Sort and select results', 'Ordena y selecciona resultados', 'Ergebnisse sortieren und auswählen', 'Trier et sélectionner les résultats') },
          { cmd: 'Invoke-WebRequest https://exemplo.com -OutFile out.html', d: T('Baixa um arquivo da web', 'Download a file from the web', 'Descarga un archivo de la web', 'Eine Datei aus dem Web laden', 'Télécharger un fichier depuis le web') },
          { cmd: "Get-ChildItem -Recurse -Filter *.log | Measure-Object", d: T('Conta arquivos por padrão recursivamente', 'Count files by pattern recursively', 'Cuenta archivos por patrón recursivamente', 'Dateien nach Muster rekursiv zählen', 'Compter les fichiers par motif récursivement') },
        ],
      },
      {
        title: T('Avançado', 'Advanced', 'Avanzado', 'Fortgeschritten', 'Avancé'),
        items: [
          { cmd: 'Invoke-Command -ComputerName srv01 -ScriptBlock { Get-Service }', d: T('Executa comandos remotamente', 'Run commands remotely', 'Ejecuta comandos de forma remota', 'Befehle remote ausführen', 'Exécuter des commandes à distance') },
          { cmd: 'Get-Content data.json | ConvertFrom-Json', d: T('Converte JSON em objetos', 'Convert JSON into objects', 'Convierte JSON en objetos', 'JSON in Objekte umwandeln', 'Convertir du JSON en objets') },
          { cmd: 'try { ... } catch { Write-Error $_ }', d: T('Tratamento de erros', 'Error handling', 'Manejo de errores', 'Fehlerbehandlung', 'Gestion des erreurs') },
          { cmd: 'Start-Job { ... }; Get-Job | Receive-Job', d: T('Executa tarefas em segundo plano', 'Run background jobs', 'Ejecuta tareas en segundo plano', 'Hintergrundjobs ausführen', 'Exécuter des tâches en arrière-plan') },
        ],
      },
    ],
  },
  'azure-cli': {
    id: 'azure-cli',
    links: [{ label: 'docs (az cli)', href: 'https://learn.microsoft.com/cli/azure/' }],
    sections: [
      install('winget install -e --id Microsoft.AzureCLI', 'brew install azure-cli', 'curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash'),
      {
        title: T('Conta e recursos', 'Account & resources', 'Cuenta y recursos', 'Konto & Ressourcen', 'Compte et ressources'),
        items: [
          { cmd: 'az login', d: T('Autentica no Azure', 'Authenticate to Azure', 'Autentica en Azure', 'Bei Azure anmelden', 'S’authentifier sur Azure') },
          { cmd: 'az account set --subscription "Minha Assinatura"', d: T('Seleciona a assinatura ativa', 'Set the active subscription', 'Establece la suscripción activa', 'Aktives Abonnement setzen', 'Définir l’abonnement actif') },
          { cmd: 'az group create -n rg-app -l brazilsouth', d: T('Cria um grupo de recursos', 'Create a resource group', 'Crea un grupo de recursos', 'Eine Ressourcengruppe erstellen', 'Créer un groupe de ressources') },
          { cmd: 'az resource list -o table', d: T('Lista recursos em formato de tabela', 'List resources as a table', 'Lista recursos en formato tabla', 'Ressourcen als Tabelle auflisten', 'Lister les ressources sous forme de tableau') },
        ],
      },
      {
        title: T('Computação e AKS', 'Compute & AKS', 'Cómputo y AKS', 'Compute & AKS', 'Calcul et AKS'),
        items: [
          { cmd: 'az vm list -d -o table', d: T('Lista VMs com detalhes', 'List VMs with details', 'Lista VMs con detalles', 'VMs mit Details auflisten', 'Lister les VM avec détails') },
          { cmd: 'az aks get-credentials -g rg -n meu-aks', d: T('Configura o kubectl para um cluster AKS', 'Configure kubectl for an AKS cluster', 'Configura kubectl para un clúster AKS', 'kubectl für ein AKS-Cluster konfigurieren', 'Configurer kubectl pour un cluster AKS') },
          { cmd: 'az webapp up -n meu-app', d: T('Faz deploy de um web app', 'Deploy a web app', 'Despliega una web app', 'Eine Web-App bereitstellen', 'Déployer une web app') },
          { cmd: 'az storage blob upload -f a.txt -c cont -n a.txt', d: T('Envia um blob para o storage', 'Upload a blob to storage', 'Sube un blob al storage', 'Ein Blob in den Speicher laden', 'Téléverser un blob vers le stockage') },
        ],
      },
    ],
  },
  'aws-cli': {
    id: 'aws-cli',
    links: [{ label: 'docs (aws cli)', href: 'https://docs.aws.amazon.com/cli/' }],
    sections: [
      install('winget install -e --id Amazon.AWSCLI', 'brew install awscli', 'sudo apt-get install -y awscli'),
      {
        title: T('Básico', 'Basic', 'Básico', 'Grundlagen', 'Basique'),
        items: [
          { cmd: 'aws configure', d: T('Configura credenciais e região', 'Set up credentials and region', 'Configura credenciales y región', 'Anmeldedaten und Region einrichten', 'Configurer identifiants et région') },
          { cmd: 'aws s3 ls', d: T('Lista os buckets S3', 'List S3 buckets', 'Lista los buckets S3', 'S3-Buckets auflisten', 'Lister les buckets S3') },
          { cmd: 'aws ec2 describe-instances -o table', d: T('Lista instâncias EC2', 'List EC2 instances', 'Lista instancias EC2', 'EC2-Instanzen auflisten', 'Lister les instances EC2') },
        ],
      },
      {
        title: T('Intermediário', 'Intermediate', 'Intermedio', 'Mittel', 'Intermédiaire'),
        items: [
          { cmd: 'aws s3 sync ./site s3://meu-bucket', d: T('Sincroniza uma pasta com um bucket', 'Sync a folder to a bucket', 'Sincroniza una carpeta con un bucket', 'Einen Ordner mit einem Bucket synchronisieren', 'Synchroniser un dossier vers un bucket') },
          { cmd: 'aws ec2 start-instances --instance-ids i-0abc', d: T('Inicia uma instância EC2', 'Start an EC2 instance', 'Inicia una instancia EC2', 'Eine EC2-Instanz starten', 'Démarrer une instance EC2') },
          { cmd: 'aws logs tail /aws/lambda/minha-fn --follow', d: T('Acompanha logs do CloudWatch', 'Follow CloudWatch logs', 'Sigue logs de CloudWatch', 'CloudWatch-Logs verfolgen', 'Suivre les logs CloudWatch') },
        ],
      },
      {
        title: T('Avançado', 'Advanced', 'Avanzado', 'Fortgeschritten', 'Avancé'),
        items: [
          { cmd: 'aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId"', d: T('Filtra a saída com JMESPath', 'Filter output with JMESPath', 'Filtra la salida con JMESPath', 'Ausgabe mit JMESPath filtern', 'Filtrer la sortie avec JMESPath') },
          { cmd: 'aws sts assume-role --role-arn arn:... --role-session-name s1', d: T('Assume um papel IAM temporário', 'Assume a temporary IAM role', 'Asume un rol IAM temporal', 'Eine temporäre IAM-Rolle annehmen', 'Assumer un rôle IAM temporaire') },
          { cmd: 'aws cloudformation deploy --template-file t.yaml --stack-name s1', d: T('Faz deploy de uma stack CloudFormation', 'Deploy a CloudFormation stack', 'Despliega una stack CloudFormation', 'Einen CloudFormation-Stack bereitstellen', 'Déployer une stack CloudFormation') },
          { cmd: 'aws eks update-kubeconfig --name meu-cluster', d: T('Configura o kubectl para um cluster EKS', 'Configure kubectl for an EKS cluster', 'Configura kubectl para un clúster EKS', 'kubectl für ein EKS-Cluster konfigurieren', 'Configurer kubectl pour un cluster EKS') },
        ],
      },
    ],
  },
  'a11y-cli': {
    id: 'a11y-cli',
    links: [
      { label: 'Pa11y', href: 'https://pa11y.org' },
      { label: 'axe-core', href: 'https://github.com/dequelabs/axe-core' },
      { label: 'Lighthouse', href: 'https://developer.chrome.com/docs/lighthouse/' },
      { label: 'IBM Equal Access', href: 'https://github.com/IBMa/equal-access' },
    ],
    sections: [
      {
        title: T('Pré-requisito: Node.js', 'Prerequisite: Node.js', 'Requisito: Node.js', 'Voraussetzung: Node.js', 'Prérequis : Node.js'),
        items: [
          { cmd: 'winget install -e --id OpenJS.NodeJS', d: N('Windows (winget / PowerShell ou cmd)') },
          { cmd: 'brew install node', d: N('macOS (Homebrew)') },
          { cmd: 'sudo apt-get install -y nodejs npm', d: N('Linux (apt)') },
        ],
      },
      {
        title: T('Instalar as ferramentas (npm)', 'Install the tools (npm)', 'Instalar las herramientas (npm)', 'Werkzeuge installieren (npm)', 'Installer les outils (npm)'),
        items: [
          { cmd: 'npm install -g pa11y pa11y-ci', d: N('Pa11y + Pa11y-CI') },
          { cmd: 'npm install -g @axe-core/cli', d: N('axe-core CLI (Deque)') },
          { cmd: 'npm install -g lighthouse', d: N('Lighthouse (Google)') },
          { cmd: 'npm install -g accessibility-checker', d: N('IBM Equal Access (achecker)') },
        ],
      },
      {
        title: T('Verificar uma URL', 'Check a URL', 'Verificar una URL', 'Eine URL prüfen', 'Vérifier une URL'),
        items: [
          { cmd: 'pa11y https://exemplo.com', d: T('Testa uma URL (forma mais direta)', 'Test a URL (simplest way)', 'Prueba una URL (forma más directa)', 'Eine URL testen (einfachster Weg)', 'Tester une URL (le plus simple)') },
          { cmd: 'pa11y --standard WCAG2AAA --runner axe https://exemplo.com', d: T('Define o padrão (WCAG2A/AA/AAA) e o motor', 'Set the standard (WCAG2A/AA/AAA) and engine', 'Define el estándar (WCAG2A/AA/AAA) y el motor', 'Standard (WCAG2A/AA/AAA) und Engine festlegen', 'Définir le standard (WCAG2A/AA/AAA) et le moteur') },
          { cmd: 'pa11y --reporter json https://exemplo.com > relatorio.json', d: T('Saída em JSON para pipelines', 'JSON output for pipelines', 'Salida JSON para pipelines', 'JSON-Ausgabe für Pipelines', 'Sortie JSON pour les pipelines') },
          { cmd: 'axe https://exemplo.com --tags wcag2a,wcag2aa,wcag21aa', d: T('axe-core CLI filtrando por tags WCAG', 'axe-core CLI filtered by WCAG tags', 'axe-core CLI filtrando por etiquetas WCAG', 'axe-core CLI nach WCAG-Tags gefiltert', 'axe-core CLI filtré par tags WCAG') },
          { cmd: 'lighthouse https://exemplo.com --only-categories=accessibility --output=html --output-path=./a11y.html --chrome-flags="--headless"', d: T('Auditoria de acessibilidade em relatório HTML', 'Accessibility audit as an HTML report', 'Auditoría de accesibilidad en informe HTML', 'Barrierefreiheits-Audit als HTML-Bericht', 'Audit d’accessibilité en rapport HTML') },
          { cmd: 'achecker https://exemplo.com', d: T('IBM Equal Access: relatório detalhado (WCAG 2.1/2.2)', 'IBM Equal Access: detailed report (WCAG 2.1/2.2)', 'IBM Equal Access: informe detallado (WCAG 2.1/2.2)', 'IBM Equal Access: detaillierter Bericht (WCAG 2.1/2.2)', 'IBM Equal Access : rapport détaillé (WCAG 2.1/2.2)') },
        ],
      },
      {
        title: T('CI e múltiplas URLs', 'CI & multiple URLs', 'CI y múltiples URLs', 'CI & mehrere URLs', 'CI et plusieurs URLs'),
        items: [
          { cmd: 'pa11y-ci', d: T('Falha o build acima do limite (config .pa11yci)', 'Fails the build above the threshold (.pa11yci config)', 'Falla el build por encima del umbral (config .pa11yci)', 'Lässt den Build über dem Schwellwert fehlschlagen (.pa11yci)', 'Fait échouer le build au-delà du seuil (config .pa11yci)') },
          { cmd: "curl -s https://exemplo.com/sitemap.xml | grep -oP '(?<=<loc>)[^<]+' > urls.txt", d: T('Extrai a lista de URLs do sitemap', 'Extract the URL list from the sitemap', 'Extrae la lista de URLs del sitemap', 'URL-Liste aus der Sitemap extrahieren', 'Extraire la liste des URL du sitemap') },
          { cmd: 'npm install -D @axe-core/playwright @playwright/test', d: T('Integra o axe nos testes Playwright (E2E)', 'Integrate axe into Playwright tests (E2E)', 'Integra axe en las pruebas Playwright (E2E)', 'axe in Playwright-Tests integrieren (E2E)', 'Intégrer axe aux tests Playwright (E2E)') },
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
