import {
    getEventHash,
    signEvent,
  } from 'nostr-tools';

const publishEvent = (relay, pk, sk, changeAbout, changeWebsite, metaData) => {
    var event = {
        kind: 0,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: `{"about": "${changeAbout}", "website": "${changeWebsite}", "display_name": "${metaData.display_name}", "name": "${metaData.name}"}`,
      };
  
      event.id = getEventHash(event);
      event.sig = signEvent(event, sk);
  
      const pub = relay.publish(event);
  
      pub.on('ok', () => {
        setPubStatus('our event is published');
      });
      pub.on('failed', reason => {
        setPubStatus(`failed to publish message ${reason}`);
      });
  }
  
  export {publishEvent}