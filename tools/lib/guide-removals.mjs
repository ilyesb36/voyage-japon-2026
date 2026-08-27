// Entrées retirées du guide, volontairement.
//
// Ce ne sont pas des pertes : des évidences (« on ira au konbini de toute
// façon »), des types de plat qui doublonnaient une vraie adresse
// (« Tsukemen » vs Fuunji), ou des doublons purs.
//
// La clé est l'IDENTIFIANT, pas le nom : deux entrées peuvent porter le même
// nom, et l'une des deux vient de l'amie guide — il ne faut surtout pas
// retirer celle-là.

export const REMOVED = new Map([
  // Ramen
  ["spot-ramen", "Type de plat, pas une adresse — l'exemple du proprio"],
  // Izakaya
  ["spot-izakaya", "Type de lieu trop vague — l'exemple du proprio"],
  // Matcha
  ["spot-matcha", "Type de boisson, pas une adresse — l'exemple du proprio"],
  // Konbini run
  ["spot-konbini-run", "Évidence citée par le proprio : on y ira sans y penser, le blurb n'apporte pas d'info actionnable"],
  // Kaisendon
  ["spot-kaisendon", "Type de plat générique, doublon sémantique de Tsujihan (le kaisendon nommé de Nihonbashi)"],
  // Tsukemen
  ["spot-tsukemen", "Type de plat générique, doublon de Fuunji (« le tsukemen culte de Shinjuku »)"],
  // Tempura
  ["spot-tempura", "Type de plat générique, doublon de Tempura Daikokuya (l'institution d'Asakusa)"],
  // Takoyaki
  ["spot-takoyaki", "Type de plat générique, doublon de Wanaka (takoyaki nommé depuis 1938)"],
  // Okonomiyaki
  ["spot-okonomiyaki", "Type de plat générique, doublon d'Ajinoya (l'okonomiyaki Bib Gourmand)"],
  // Œufs noirs d'Owakudani
  ["spot-ufs-noirs-d-owakudani", "Doublon sémantique : le spot Owakudani (t0) mentionne déjà « fumerolles + œufs noirs », et il y a aussi Le Fuji depuis Owakudani (t5)"],
  // Sashimi à Omicho
  ["spot-sashimi-a-omicho", "Doublon de l'expérience marché : Kaisendon d'Omicho (ob) et Morimori Sushi couvrent déjà Omicho"],
  // Marché Kuromon
  ["spot-marche-kuromon-2", "Doublon exact du Marché Kuromon source=guide (t1)"],
  // Don Quijote
  ["spot-don-quijote", "Évidence citée par le proprio : chaîne partout, on y passera sans liste"],
  // Depachika
  ["spot-depachika", "Évidence citée par le proprio : les sous-sols des grands magasins, on y tombera forcément"],
  // KitKat japonais
  ["spot-kitkat-japonais", "Évidence : s'achète au konbini / Don Quijote sans y penser"],
  // 2nd Street
  ["spot-2nd-street", "Chaîne de friperies générique (« partout au Japon »), déjà nommée dans le blurb de Fripes Y2K"],
]);
