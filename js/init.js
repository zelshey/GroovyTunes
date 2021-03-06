var socket = null;
var isopen = false;
var songs = {};
var playlists = {};
var songsToPlay = [];
var playlist = '';
var username = '';

window.onload = function() {
    var originalValue;
    $('#playlistTitle').on('dblclick', function(){
        originalValue = $(this).text();
        console.log(originalValue)
        $(this).text('');
        $("<input type='text'>").appendTo(this).focus();
    });
    $('#playlistTitle').on('focusout', 'input', function(){
        if($(this).val() == '' || $(this).val() == originalValue){
            $(this).parent().text(originalValue);
            console.log('ding');
        }else{
            rename_playlist($(this).val());
        }
        $(this).remove();
    });



  socket = new WebSocket("ws://127.0.0.1:8080");
  socket.onopen = function() {
    console.log("Connected!");
    isopen = true;
  }
  socket.onmessage = function(e) {
    var message = JSON.parse(e.data);
    console.log(message);
    switch(message.type){
        case "retRegistration":
          if(message.status == 'success'){
              alert(message.message);
          }else{
              alert(message.message);
          }
          break;
        case "retLogin":
            if(message.status == 'success'){
                $('.sign_in').addClass('hidden_element');
                $('.userControl').removeClass('hidden_element');
                var url = new URL(window.location.href);
                var id = url.searchParams.get('id');
                if(id){
                    get_shared_playlist(id);
                }
                get_playlists();
                get_all_songs();
                get_user_info();
                username = message.name;
                $('#dropdownMenuButton').html(username);
            }else{
                alert(message.message);
            }
            break;
        case "ret-get-info":
            $('#dropdownMenuButton').html(username + "[" + message.status + "]");
            break;
        case "ret-activate-premium":
            get_user_info();
            break;
        case "retLogout":
              if(message.status == 'success'){
                  $('.sign_in').addClass('visible_element');
              }else{
                  alert(message.message);
              }
              break;
        case "ret-get-playlists":
            playlists = message.playlists;
            dispPlaylists();
            break;
        case "get-all-songs":
            _.each(message.songs, function(_song){
                songs[_song.songID] = _song;
            });
            showAllSongs();
            break;
        case "ret-get-songs":
            playlist = message.name;
            var s = {};
            _.each(message.songs, function(_song){
                s[_song.songID] = _song;
            });
            showSongs(message.name, s);
            $('#playlistButtons').removeClass('hidden_element');
            break;
        case 'ret-create-playlist':
            get_playlists();
            break;
        case 'ret-remove-song':
            get_playlist_songs(playlist);
        case 'ret-add-song':
            break;
        case 'ret-remove-playlist':
            get_playlists();
            showAllSongs();
            break;
        case 'ret-rename-playlist':
            get_playlists();
            $('#playlistTitle').html(message.name);
            break;
        case 'ret-get-sharable-link':
            var id = message.link;
            var url = window.location.href;
            var split = url.split('?');
            var sharable = split[0] + '?id=' + id;
            alert(sharable);
            break;
        case 'ret-add-shared-playlist':
            break;
        case 'ret-play':
            if(message['type-of-playable'] == 'playlist'){
                songsToPlay = message.songs
                var song = songsToPlay.shift();
                if (song){
                    dispPlayer(song.id, song.url);
                }
            }else{
                songsToPlay = [];
                dispPlayer(message.id, message.url);
            }
            break;
    }
  }

  socket.onclose = function(e) {
    console.log("Connection closed.");
    socket = null;
    isopen = false;
  }
};

function showSongs(_name, _songs, _add){
    var fields = ['title', 'albumArtist', 'album', 'genre', 'duration'];
    var html = '<table class="table table-hover"><tr>';
    _.each(fields, function(_field){html += '<th>' + capitalizeFirst(_field) + '</th>'});
    html += '</tr>';
    _.each(_songs, function(_meta, _id) {
        html += '<tr>';
        _.each(fields, function(_field){
            var toDisp = (_field == 'duration') ? (Math.floor(_meta[_field]/60) + ':' + ((_meta[_field]%60 + "").length == 1 ?_meta[_field]%60 + '0' : _meta[_field]%60)) : (_meta[_field] || '');
            html += '<td onclick="get_playable_song(\'' + _id + '\')">' + toDisp + '</td>';
        });
        if(_add){
            html += '<td onclick="clickedAddButton(\'' + _id + '\')">+</td>';
        }else{
            html += '<td onclick="remove_song(\'' + _id + '\')">-</td>';
        }
        html += '</tr>';
    });
    html += '</table>';
    $('#songs').html(html);
    $('#playlistTitle').html(_name);
}
function showAllSongs() {
    showSongs('All Songs', songs, true);
    $('#playlistButtons').addClass('hidden_element');
}

function clickedAddButton(_id){
    html = '';
    _.each(playlists, function(playlist){
        html += '<option value="' + playlist.name +  ' ' + _id + '">' + playlist.name + '</option>';
    });
    $('#options').html(html);
    $('#myModal').modal('show');
}

function capitalizeFirst(_str){
  return _str.charAt(0).toUpperCase() + _str.slice(1);
}

function generateName(){
    return 'new_' + (new Date()).getMilliseconds();
}

function dispPlaylists(){
    var html = '';
        html += '<li onclick="showAllSongs()">' + 'All Songs' + '</li>';
    _.each(playlists, function(playlist){
        html += '<li onclick="get_playlist_songs(\'' + playlist.name + '\')">' + (playlist.name || 'New Playlist') + '</li>';
    });
    $('#playlists').html(html);
}

function dispPlayer(_id, _url){
    html = '<h3>' + songs[_id].title + ' by ' + songs[_id].albumArtist +'</h3><audio id="playBar" controls autoplay><source src="\.\./' + _url + '" type="audio/mpeg">Your browser does not support the audio element.</audio>';
    $('#player').html(html);
    $('#playBar').bind('ended', function(){
        var song = songsToPlay.shift();
        if(song){
            dispPlayer(song.id, song.url);
        }
    });
}
