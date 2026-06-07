// Linux/macOS ↔ PowerShell command comparison data. The commands are
// language-neutral; only the short description is translated (same 5 languages
// as i18n). Used by CmdCompare.tsx.
export type Lang = 'pt-BR' | 'en-US' | 'es' | 'de' | 'fr';

export type CmdRow = { sh: string; ps: string; d: Record<Lang, string> };
export type CmdSection = { title: Record<Lang, string>; items: CmdRow[] };

const T = (pt: string, en: string, es: string, de: string, fr: string): Record<Lang, string> => ({
  'pt-BR': pt,
  'en-US': en,
  es,
  de,
  fr,
});

export const CMD_SECTIONS: CmdSection[] = [
  {
    title: T('Arquivos: listagem e informações', 'Files: listing & info', 'Archivos: listado e información', 'Dateien: Auflisten & Infos', 'Fichiers : listage et infos'),
    items: [
      { sh: 'ls -la', ps: 'Get-ChildItem -Force', d: T('Lista arquivos (inclui ocultos), detalhado', 'List files (incl. hidden), detailed', 'Lista archivos (incl. ocultos), detallado', 'Dateien auflisten (inkl. versteckte), detailliert', 'Lister les fichiers (cachés inclus), détaillé') },
      { sh: 'pwd', ps: 'Get-Location', d: T('Diretório atual', 'Current directory', 'Directorio actual', 'Aktuelles Verzeichnis', 'Répertoire courant') },
      { sh: 'find . -name "*.log"', ps: 'Get-ChildItem -Recurse -Filter *.log', d: T('Encontra arquivos por nome', 'Find files by name', 'Encuentra archivos por nombre', 'Dateien nach Namen finden', 'Trouver des fichiers par nom') },
      { sh: 'stat arquivo', ps: 'Get-Item arquivo | Format-List *', d: T('Metadados detalhados do arquivo', 'Detailed file metadata', 'Metadatos detallados del archivo', 'Detaillierte Datei-Metadaten', 'Métadonnées détaillées du fichier') },
      { sh: 'du -sh dir', ps: '(Get-ChildItem dir -Recurse | Measure-Object Length -Sum).Sum', d: T('Tamanho total de um diretório', 'Total size of a directory', 'Tamaño total de un directorio', 'Gesamtgröße eines Verzeichnisses', 'Taille totale d’un répertoire') },
      { sh: 'wc -l arquivo', ps: '(Get-Content arquivo).Count', d: T('Conta as linhas de um arquivo', 'Count the lines of a file', 'Cuenta las líneas de un archivo', 'Zeilen einer Datei zählen', 'Compter les lignes d’un fichier') },
      { sh: 'head -n 20 arquivo', ps: 'Get-Content arquivo -Head 20', d: T('Primeiras 20 linhas', 'First 20 lines', 'Primeras 20 líneas', 'Erste 20 Zeilen', '20 premières lignes') },
      { sh: 'tail -n 20 arquivo', ps: 'Get-Content arquivo -Tail 20', d: T('Últimas 20 linhas', 'Last 20 lines', 'Últimas 20 líneas', 'Letzte 20 Zeilen', '20 dernières lignes') },
      { sh: 'tail -f arquivo.log', ps: 'Get-Content arquivo.log -Wait -Tail 10', d: T('Acompanha um log em tempo real', 'Follow a log in real time', 'Sigue un log en tiempo real', 'Log in Echtzeit verfolgen', 'Suivre un journal en temps réel') },
      { sh: 'md5sum arquivo', ps: 'Get-FileHash arquivo -Algorithm MD5', d: T('Hash (checksum) do arquivo', 'File hash (checksum)', 'Hash (checksum) del archivo', 'Datei-Hash (Prüfsumme)', 'Hachage (somme de contrôle) du fichier') },
    ],
  },
  {
    title: T('Sistema: data/hora e informações', 'System: date/time & info', 'Sistema: fecha/hora e información', 'System: Datum/Uhrzeit & Infos', 'Système : date/heure et infos'),
    items: [
      { sh: 'date', ps: 'Get-Date', d: T('Data e hora atuais', 'Current date and time', 'Fecha y hora actuales', 'Aktuelles Datum und Uhrzeit', 'Date et heure actuelles') },
      { sh: 'date +%Y-%m-%d', ps: 'Get-Date -Format yyyy-MM-dd', d: T('Data em formato específico', 'Date in a specific format', 'Fecha en formato específico', 'Datum in einem bestimmten Format', 'Date dans un format spécifique') },
      { sh: 'uptime', ps: '(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime', d: T('Há quanto tempo a máquina está ligada', 'How long the machine has been up', 'Cuánto lleva encendida la máquina', 'Wie lange die Maschine läuft', 'Depuis combien de temps la machine est allumée') },
      { sh: 'hostname', ps: '$env:COMPUTERNAME', d: T('Nome do host', 'Host name', 'Nombre del host', 'Hostname', 'Nom de l’hôte') },
      { sh: 'whoami', ps: 'whoami', d: T('Usuário atual', 'Current user', 'Usuario actual', 'Aktueller Benutzer', 'Utilisateur courant') },
      { sh: 'uname -a', ps: 'Get-ComputerInfo', d: T('Informações do sistema', 'System information', 'Información del sistema', 'Systeminformationen', 'Informations système') },
      { sh: 'df -h', ps: 'Get-PSDrive -PSProvider FileSystem', d: T('Uso de disco por volume', 'Disk usage per volume', 'Uso de disco por volumen', 'Speicherplatz pro Volume', 'Espace disque par volume') },
      { sh: 'ps aux', ps: 'Get-Process', d: T('Lista os processos em execução', 'List running processes', 'Lista los procesos en ejecución', 'Laufende Prozesse auflisten', 'Lister les processus en cours') },
      { sh: 'printenv', ps: 'Get-ChildItem Env:', d: T('Lista as variáveis de ambiente', 'List environment variables', 'Lista las variables de entorno', 'Umgebungsvariablen auflisten', 'Lister les variables d’environnement') },
      { sh: 'echo $PATH', ps: '$env:PATH', d: T('Mostra a variável PATH', 'Show the PATH variable', 'Muestra la variable PATH', 'Die PATH-Variable anzeigen', 'Afficher la variable PATH') },
    ],
  },
  {
    title: T('Manipulação de arquivos', 'File manipulation', 'Manipulación de archivos', 'Dateimanipulation', 'Manipulation de fichiers'),
    items: [
      { sh: 'touch arquivo', ps: 'New-Item arquivo -ItemType File', d: T('Cria um arquivo vazio', 'Create an empty file', 'Crea un archivo vacío', 'Eine leere Datei erstellen', 'Créer un fichier vide') },
      { sh: 'mkdir -p a/b', ps: 'New-Item a/b -ItemType Directory -Force', d: T('Cria diretórios (com os pais)', 'Create directories (with parents)', 'Crea directorios (con los padres)', 'Verzeichnisse erstellen (mit Eltern)', 'Créer des répertoires (avec parents)') },
      { sh: 'cp -r origem destino', ps: 'Copy-Item origem destino -Recurse', d: T('Copia recursivamente', 'Copy recursively', 'Copia recursivamente', 'Rekursiv kopieren', 'Copier récursivement') },
      { sh: 'mv origem destino', ps: 'Move-Item origem destino', d: T('Move ou renomeia', 'Move or rename', 'Mueve o renombra', 'Verschieben oder umbenennen', 'Déplacer ou renommer') },
      { sh: 'rm -rf dir', ps: 'Remove-Item dir -Recurse -Force', d: T('Remove recursivamente (cuidado!)', 'Remove recursively (be careful!)', 'Elimina recursivamente (¡cuidado!)', 'Rekursiv löschen (Vorsicht!)', 'Supprimer récursivement (attention !)') },
      { sh: 'cat arquivo', ps: 'Get-Content arquivo', d: T('Mostra o conteúdo do arquivo', 'Print the file contents', 'Muestra el contenido del archivo', 'Dateiinhalt anzeigen', 'Afficher le contenu du fichier') },
      { sh: 'echo "texto" > arquivo', ps: '"texto" | Set-Content arquivo', d: T('Escreve no arquivo (sobrescreve)', 'Write to the file (overwrite)', 'Escribe en el archivo (sobrescribe)', 'In die Datei schreiben (überschreiben)', 'Écrire dans le fichier (écrase)') },
      { sh: 'echo "texto" >> arquivo', ps: '"texto" | Add-Content arquivo', d: T('Acrescenta ao fim do arquivo', 'Append to the end of the file', 'Añade al final del archivo', 'An das Dateiende anhängen', 'Ajouter à la fin du fichier') },
      { sh: 'ln -s alvo link', ps: 'New-Item -ItemType SymbolicLink -Path link -Target alvo', d: T('Cria um link simbólico', 'Create a symbolic link', 'Crea un enlace simbólico', 'Einen symbolischen Link erstellen', 'Créer un lien symbolique') },
      { sh: 'grep -r "texto" .', ps: 'Get-ChildItem -Recurse | Select-String "texto"', d: T('Procura texto dentro dos arquivos', 'Search text inside files', 'Busca texto dentro de los archivos', 'Text in Dateien suchen', 'Rechercher du texte dans les fichiers') },
    ],
  },
  {
    title: T('Pipes, redirecionamento e tee', 'Pipes, redirection & tee', 'Tuberías, redirección y tee', 'Pipes, Umleitung & tee', 'Tubes, redirection et tee'),
    items: [
      { sh: 'comando | grep "texto"', ps: 'comando | Select-String "texto"', d: T('Filtra a saída por um padrão', 'Filter the output by a pattern', 'Filtra la salida por un patrón', 'Ausgabe nach einem Muster filtern', 'Filtrer la sortie par un motif') },
      { sh: 'comando | wc -l', ps: 'comando | Measure-Object -Line', d: T('Conta as linhas da saída', 'Count the output lines', 'Cuenta las líneas de la salida', 'Ausgabezeilen zählen', 'Compter les lignes de sortie') },
      { sh: 'comando | sort | uniq', ps: 'comando | Sort-Object -Unique', d: T('Ordena e remove duplicados', 'Sort and remove duplicates', 'Ordena y elimina duplicados', 'Sortieren und Duplikate entfernen', 'Trier et supprimer les doublons') },
      { sh: 'comando | tee arquivo', ps: 'comando | Tee-Object arquivo', d: T('Mostra na tela E salva em arquivo', 'Print to screen AND save to a file', 'Muestra en pantalla Y guarda en archivo', 'Auf dem Bildschirm anzeigen UND in Datei speichern', 'Afficher à l’écran ET enregistrer dans un fichier') },
      { sh: 'comando | tee -a arquivo', ps: 'comando | Tee-Object arquivo -Append', d: T('Como tee, mas acrescenta ao arquivo', 'Like tee, but appends to the file', 'Como tee, pero añade al archivo', 'Wie tee, hängt aber an die Datei an', 'Comme tee, mais ajoute au fichier') },
      { sh: 'comando > saida.log 2>&1', ps: 'comando *> saida.log', d: T('Redireciona saída e erros para um arquivo', 'Redirect output and errors to a file', 'Redirige salida y errores a un archivo', 'Ausgabe und Fehler in eine Datei umleiten', 'Rediriger sortie et erreurs vers un fichier') },
      { sh: 'ps aux | grep nginx', ps: 'Get-Process | Where-Object Name -match nginx', d: T('Encontra um processo pelo nome', 'Find a process by name', 'Encuentra un proceso por nombre', 'Einen Prozess nach Namen finden', 'Trouver un processus par son nom') },
      { sh: 'du -ah | sort -rh | head', ps: 'Get-ChildItem -Recurse | Sort-Object Length -Descending | Select-Object -First 10', d: T('Maiores arquivos (combinação com pipe)', 'Largest files (piped combo)', 'Archivos más grandes (combinación con pipe)', 'Größte Dateien (Pipe-Kombination)', 'Fichiers les plus volumineux (combinaison avec pipe)') },
      { sh: 'grep -rl "texto" .', ps: 'Get-ChildItem -Recurse | Select-String "texto" -List | ForEach-Object Path', d: T('Lista os arquivos que contêm um texto', 'List files that contain a text', 'Lista los archivos que contienen un texto', 'Dateien auflisten, die einen Text enthalten', 'Lister les fichiers contenant un texte') },
      { sh: 'history | grep ssh', ps: 'Get-History | Where-Object CommandLine -match ssh', d: T('Busca no histórico de comandos', 'Search the command history', 'Busca en el historial de comandos', 'Im Befehlsverlauf suchen', 'Rechercher dans l’historique des commandes') },
    ],
  },
];
