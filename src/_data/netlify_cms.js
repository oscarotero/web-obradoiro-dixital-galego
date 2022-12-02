import t from "https://deno.land/x/netlify_cms_config@v0.3.1/mod.ts";

// Defaults
t.defaultRequired = false;
t.defaults.object.collapsed();
t.defaults.list.collapsed().minimizeCollapsed();
t.defaults.markdown.minimal();

const metas = [
   t.string("Title").hint('Título da páxina concreta (ou xeral), sae na miniatura das ligazóns.'),
   t.string("Site").hint('Título do sitio web, sae na miniatura das ligazóns.'),
   t.string("Description").hint('Descripción do sitio web, sae na miniatura das ligazóns.'),
   t.list("keywords").collapsed(false).hint('Palabras chave para que os navegadores indexen o contido, separadas por comas'),
   t.image("Image").hint("Esta imaxe será a que sala nas miniaturas cando se enlaze a páxina"),
   t.boolean("Robots").default(true).hint("Permite os robots dos navegadores indexar a páxina e que apareza nos resultados de búsqueda"),
   t.string("twitter").hint("Se se especifica, permite facer a twitter coller os datos do sitio e enlazalos o perfil. Poñer só o '@usuario'"),
   t.string("title_suffix").hint("O sufixo que se porá no título da páxina despois da propia páxina."),
];

const textPages = [
   t.string("Title"),
   t.string("Url"),
   t.object("Metas", metas),
   t.markdown("Body"),
];

const pages = t.files("Páxinas")
   .description("Aquí podes editar as páxinas indivuais")
   .sortableFields("title")
   .preview(false)
   .file("Portada", "/src/index.yml", [
      t.string("title").required(true),
      t.hidden("layout"),
      t.object("header", [
         t.string("Title"),
      ]),
      t.object("action", [
         t.markdown("title"),
         t.string("code"),
         t.string("button"),
         t.string("url"),
      ]),
      t.list("features", [
         t.string("Title"),
         t.image("Img"),
         t.markdown("Description"),
      ]),
      t.object("examples", [
         t.markdown("title"),
         t.string("more"),
         t.string("url"),
      ]),
      t.object("support", [
         t.string("Title"),
         t.object("contribute", [
            t.string("title"),
            t.markdown("description"),
         ]),
         t.list("sponsors", [
            t.string("name"),
            t.image("img"),
            t.string("url"),
         ]).collapsed(false),
      ]),
      t.object("testimonials", [
         t.string("Title"),
      ]),
      t.object("FAQ", [
         t.string("title"),
         t.markdown("description"),
         t.list("questions", [
            t.string("title"),
            t.markdown("answer"),
         ]).collapsed(false),
      ]),
   ])
   .file("Comunidade", "/src/comunidade/index.yml", [
      t.hidden("layout"),
      t.string("title").required(true),
      t.string("description").required(true),
   ])
   .file("Política de privacidade", "/src/politica-privacidade.md", textPages);

const globalData = t.files("Axustes")
   .description("Aquí podes editar os axustes e datos comúns a toda a web")
   .sortableFields("title")
   .preview(false)
   .file("Metadatos", "/src/_data/metas.yml", metas)
   .file("Etiquetas", "/src/_data/categorias.yml", [
      t.list("Tags", [
         t.string("Id").required(true),
         t.string("Name").required(true),
         t.select("Color", ["lemonchiffon", "tomato", "violet", "gold", "lightskyblue", "lightgreen", "pink", "lightgray"]).required(true),
      ]).minimizeCollapsed(false)
   ]);

// Proxectos da comunidade
const comunidade = t.folder("Comunidade", "/src/comunidade/proxectos", [
   t.hidden("layout", "layouts/proxecto.njk").required(true),
   t.hidden("type", "proxecto").required(true),
   t.string("title").required(true).hint('Título do proxecto: Pode ser o nome da canle ou do farangullo.'),
   t.string("href").required(true).hint('Ligazón principal do proxecto. Pode ser unha canle de Twitch/Youtube ou un beacons/linktree'),
   t.image("img").hint('Imaxe do proxecto. Ten que ser cadrada, de ser posible 400x400.'),
   t.markdown("description").required(true).hint("Descripción breve do proxecto. Recomendamos máximo uns 160 caracteres."),
   t.datetime("date").required(true).timeFormat(false),
   t.boolean("active"),
   t.select("platform", ["twitch", "youtube", "podcast"]),
   t.object("redes", [
      t.string("twitter").hint('Ligazón o usuario de Twitter, por exemplo: https://twitter.com/AC_ODC'),
      t.string("mastodon").hint('Ligazón o usuario de Mastodon, por exemplo: https://mastodon.gal/acodega'),
      t.string("twitch").hint('Ligazón o usuario de Twitch, por exemplo: https://twitch.tv/acodega'),
      t.string("youtube").hint('Ligazón a canle de Youtube coa UUID, por exemplo: https://www.youtube.com/channel/UClavUfgzYt5uSgtBJbPoXqA'),
      t.string("facebook").hint('Ligazón a páxina de facebook, por exemplo: https://www.facebook.com/GalegoTwitch'),
      t.string("instagram").hint('Ligazón a canle de Instagram, por exemplo: https://www.instagram.com/twitchengalego/'),
      t.string("tiktok").hint('Ligazón a canle de TikTok, por exemplo: https://www.tiktok.com/@a_lobeira_today'),
      t.string("telegram").hint('Ligazón a canle de Telegram, por exemplo: https://t.me/GalizanGamer'),
      t.string("ivoox").hint('Ligazón a canle de Telegram, por exemplo: https://www.ivoox.com/podcast-recuncho-gamer-podcast_sq_f11092284_1.html'),
      t.string("spotify").hint('Ligazón a canle de Telegram, por exemplo: https://open.spotify.com/user/tcciszh0d6inj0tw6w2c0rrd5'),
      t.string("rss").hint('Ligazón ao feed RSS de contido, por exemplo: https://www.ivoox.com/podcast-a-gruta-gizamaluke_fg_f1629621_filtro_1.xml'),
   ]),
   t.relation("tags")
      .collection("axustes")
      .file('etiquetas')
      .searchFields(["tags.*.name"])
      .displayFields(["tags.*.name"])
      .valueField("tags.*.id")
      .multiple(true).required(true).hint("Etiquetas para clasificar o contido. Engadir as plataformas principais para que se poida filtrar por elas.")
])
   .description("Aquí podes editar os proxectos que forman parte da comunidade")
   .sortableFields("title", "date")
   .viewFilter("Activas", "active", true)
   .viewFilter("Canles de Twitch", "tags", "twitch")
   .viewFilter("Canles de Youtube", "tags", "youtube")
   .viewFilter("Canles de Podcast", "tags", "podcast")
   .viewGroup("Plataforma", "tags", "twitch|youtube|podcast")
   .viewGroup("Activa", "active", "true")
   .preview(false)
   .mediaFolder("/src/img/comunidade")
   .publicFolder("/img/comunidade")
   .create(true).delete(true)
   .slug("{{title}}");

export default {
   backend: {
      name: "git-gateway",
      branch: "main",
   },
   publish_mode: "editorial_workflow",
   site_url: "https://obradoiro-dixital-galego.netlify.app/",
   logo_url: "/logo.png",
   media_folder: "src/img/comunidade",
   public_folder: "/img/comunidade",
   slug: {
      encoding: "ascii",
      clean_accents: true
   },
   collections: [
      globalData.toJSON(),
      pages.toJSON(),
      comunidade.toJSON(),
   ],
};
