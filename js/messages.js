function get_playlists(){
    var msg = {
        'type':'get-playlists',
        'level':'playlist-level',
    }
    socket.send(JSON.stringify(msg));
}

function get_playable_song(_id){
    var msg = {
        'type':'play',
        'level':'playlist-level',
        'type-of-playble':'song',
        'id':_id,
    }
    socket.send(JSON.stringify(msg));
}

function get_playable_playlist(){
    var msg = {
        'type':'play',
        'level':'playlist-level',
        'type-of-playble':'playlist',
        'name':playlist,
    }
    socket.send(JSON.stringify(msg));
}

function get_all_songs(){
    msg = {
        'type':'get-all-songs',
        'level':'playlist-level'
    }
    socket.send(JSON.stringify(msg));
}

function createPlaylist(){
    var msg = {
        type: 'create-playlist',
        name: generateName(),
        level:'playlist-level',
    }
    socket.send(JSON.stringify(msg));
}

function get_playlist_songs(_name){
    var msg = {
        'type': 'get-songs',
        'name': _name,
        'level':'playlist-level',
    }
    socket.send(JSON.stringify(msg));
}

function login(){
    var username = $('#inputUsername').val();
    var pass = $('#inputPassword').val();
    var msg = {
        'type': 'login',
        'level': 'user',
        'username': username,
        'password':pass,
    }
    socket.send(JSON.stringify(msg));
}

function registration(){
    var firstname= $('#inputFirstName').val();
    var lastname= $('#inputLastName').val();
    var dob= $('#inputDOB').val();
    var regusername = $('#regUsername').val();
    var regpass = $('#regPassword').val();
    var msg = {
        'type': 'registration',
        'level': 'user',
        'firstname':firstname,
        'lastname':lastname,
        'dob':dob,
        'regusername': regusername,
        'regpassword':regpass,
    }
    socket.send(JSON.stringify(msg));
}

function logout(){
    var msg = {
        type: 'logout',
        level:'user',
    }
    socket.send(JSON.stringify(msg));
}

function activate_premium(){
    var msg = {
        type: 'activate-premium',
        level:'user',
    }
    socket.send(JSON.stringify(msg));
}

function add_song(){
    var value =  $('#options').find(":selected").val();
    var split = value.split(" ")
    var msg = {
        'type': 'add-song',
        'level': 'playlist-level',
        'name': split[0],
        'id': split[1],
    }
    socket.send(JSON.stringify(msg));
}

function rename_playlist(_new_name){
    var msg = {
        'type': 'rename-playlist',
        'level':'playlist-level',
        'name': playlist,
        'new-name': _new_name,
    };
    socket.send(JSON.stringify(msg));
}

function remove_song(_id){
    var msg = {
        'type': 'remove-song',
        'level':'playlist-level',
        'name': playlist,
        'id': _id,
    }
    socket.send(JSON.stringify(msg));
}

function share_playlist(){
    var msg = {
        'type': 'get-sharable-link',
        'level':'playlist-level',
        'name': playlist,
    };
    socket.send(JSON.stringify(msg));
}

function delete_playlist(){
    var msg = {
        'type': 'remove-playlist',
        'level':'playlist-level',
        'name': playlist,
    };
    socket.send(JSON.stringify(msg));
}

function get_shared_playlist(_id){
    var msg = {
        'type': 'add-shared-playlist',
        'level':'playlist-level',
        'id': _id,
    };
    socket.send(JSON.stringify(msg));
}

function get_user_info(){
    var msg = {
        'type': 'get-info',
        'level': 'user'
    }
    socket.send(JSON.stringify(msg));
}
