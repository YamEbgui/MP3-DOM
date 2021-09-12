/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    if (isIdExist(player.songs , songId)) {
     console.log(1);
     document.getElementById(songId).style.fontSize="4vw";
     setTimeout(function(){
        document.getElementById(songId).style.fontSize="2vw";
        playSong(songId+1);
     } ,getSongFromId(player.songs,songId).duration * 1000);
    }
}

function getSongFromId(songs , id){
    for(let i = 0; i < songs.length; i++){
      if (songs[i].id === id){
        return songs[i];
      }
    }
}

function timeConventor(duration){
    if (duration/60 < 10){
      if (duration%60 < 10){
        return "0"+Math.floor(duration/60)+ ":0" + duration%60;
      }else{
        return "0"+Math.floor(duration/60)+ ":" + duration%60;
      }
    }else if (duration%60 < 10){
      return Math.floor(duration/60)+ ":0" + duration%60;
    }else{
      return Math.floor(duration/60)+ ":" + duration%60;
    }
  
}

function returnPropItem(playerList,id){
    if (playerList.length === 0){
      throw "non exist id";
    }else if (playerList[0].id === id){
      return playerList[0];
    }else{
      return returnPropItem(playerList.slice(1),id);
    }
}

function isIdExist(List , id){
    for(let i = 0; i < List.length; i++){
      if (List[i].id === id){
        return true;
      }
    }
    return false;
}

function playlistDuration(id) {
    let duration = 0;
    if (!isIdExist(player.playlists , id)){
      throw "non exist id for playlist";
    }else{
      for (let i = 0 ; i < returnPropItem(player.playlists,id).songs.length ; i++){
        duration += returnPropItem(player.songs,returnPropItem(player.playlists,id).songs[i]).duration;
      }
    }
    return duration;
}
/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const songTitle = createElement("p", [title],  ["song-title"],  {id : id})
    const songAlbum = createElement("p", [album],  ["song-album"],  {id : id})
    const songArtist = createElement("p", [artist],  ["song-artist"],  {id : id})
    const songDuration = createElement("p", [timeConventor(duration)],  ["song-duration"],  {id : id})
    const songImage = createElement("img", [],  ["song-image"],  {src : coverArt})
    if (duration < 120){
        songDuration.style.color ="green";
    }else if (duration > 420){
        songDuration.style.color ="red";
    }else {
        songDuration.style.color = "yellow";
    }
    const children = [songTitle , songAlbum , songArtist , songDuration, songImage]
    const classes = ["song"]
    const attrs = {id:id ,onclick: `playSong(${id})` }
    return createElement("div", children, classes, attrs)
}

function createPage(player){
    const h1=createElement("h1", ["MP3 MUSIC"],  ["headline"],  {})
    document.head.append(h1);
    for(let song of player.songs){
        document.getElementById("songs").append(createSongElement(song));
    }
    for(let playlist of player.playlists){
        document.getElementById("playlists").append(createPlaylistElement(playlist));
    }
}
/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const playlistName = createElement("p", [name],  ["playlist-name"],  {id : id})
    const playlistSongs = createElement("p", [songs.length + " songs"],  ["playlist-songs"],  {id : id})
    const children = [playlistName , playlistSongs]
    const classes = ["playlist"]
    const attrs = {}
    return createElement("div", children, classes, attrs)
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName);
    newElement.append(...children);
    newElement.classList.add(...classes);
    for ( let key in attributes){
        newElement.setAttribute(key , attributes[key] );
    }
    return newElement;
}
createPage(player);
// You can write more code below this line
