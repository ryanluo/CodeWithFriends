
( function( window ) {

// add event helper
function addEvent( obj, type, fn ) {
  if ( obj.addEventListener ) {
    obj.addEventListener( type, fn, false );
  } else if ( obj.attachEvent ) {
    obj.attachEvent( "on" + type, fn );
  }
}
( window );( function( window ) {

// add event helper
function addEvent( obj, type, fn ) {
  if ( obj.addEventListener ) {
    obj.addEventListener( type, fn, false );
  } else if ( obj.attachEvent ) {
    obj.attachEvent( "on" + type, fn );
  }
}
