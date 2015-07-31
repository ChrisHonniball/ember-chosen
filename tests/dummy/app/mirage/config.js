export default function() {
  this.get('/users', function() {
    return {
      users: [
        { id: 1, first_name: 'Jean', mi: '', last_name: 'Gray', addr1: '1407 Graymalkin Ln', city: 'Salem Center', state: 'NY', zip: '10560' },
        { id: 2, first_name: 'Charles', mi: 'F', last_name: 'Xavier', addr1: '1408 Graymalkin Ln', city: 'Salem Center', state: 'NY', zip: '10561' },
        { id: 3, first_name: 'Ororo', mi: '', last_name: 'Monroe', addr1: '1409 Graymalkin Ln', city: 'Salem Center', state: 'NY', zip: '10562' },
        { id: 4, first_name: 'Logan', mi: '', last_name: 'Howlett', addr1: '1410 Graymalkin Ln', city: 'Salem Center', state: 'NY', zip: '10563' },
        { id: 5, first_name: 'Henry', mi: 'P', last_name: 'McCoy', addr1: '1411 Graymalkin Ln', city: 'Salem Center', state: 'NY', zip: '10564' }
      ]
    };
  });
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
