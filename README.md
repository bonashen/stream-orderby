# stream-orderby
orderby for stream json objects on nodejs

##example:

```javascript
generator(5).pipe(orderBy([
  {
    keys: 'grade.name,value',
    reverse: true
  }, {
    getValue: function(doc) {
      return doc.age;
    },
    reverse: false
  }, 'name'
])).on('data', function(doc) {
  return console.log(doc);
}).once('end', function() {
  console.log("order by end.");
});

```
