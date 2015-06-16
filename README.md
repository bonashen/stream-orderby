# stream-orderby
orderby for stream json objects on nodejs

##example:
###stream.pipe API
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
if you read array object to order by,you can use `event-stream` **readArray**