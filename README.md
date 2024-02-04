## Installation
1. Clone this repository:

    ```bash
    git clone https://github.com/shahrushabh1996/adaptReady.git
    ```

2. Download the `.env` file, send it over email, and place it into the root directory.

3. Run NPM install in the root directory:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    node index.js
    ```

   The server will be running on port 3000.

5. You can make requests using Postman.

## Postman Collection

https://galactic-crescent-338846.postman.co/workspace/New-Team-Workspace~5227f87b-551d-4592-99d3-006edbc762b9/collection/29080282-3c09f653-8f17-4f24-abda-f55c74ebb0f9?action=share&creator=29080282

## Get Dish
The following is a list of supported LHS operators, along with the corresponding schema-supported operators for each key.

### LHS Operators

| Operator | Description                        |
|----------|------------------------------------|
| `eq`     | Equal to                           |
| `ne`     | Not equal to                       |
| `gt`     | Greater than                       |
| `gte`    | Greater than or equal to           |
| `lt`     | Less than                          |
| `lte`    | Less than or equal to              |
| `bw`     | Begins with                        |
| `nbw`    | Does not begin with                |
| `in`     | In the list                         |
| `nin`    | Not in the list                     |
| `all`    | All elements in the list           |
| `any`    | Any element in the list            |
| `like`   | Similar to (pattern matching)      |
| `nlike`  | Not similar to (pattern matching)  |
| `sw`     | Starts with                        |
| `ew`     | Ends with                          |

### LHS Schema

| Key            | Supported Operators                                 |
|----------------|-----------------------------------------------------|
| name           | `eq`, `ne`, `like`, `nlike`, `sw`, `ew`             |
| ingredients    | `contain`, `contained`, `overlap`                   |
| diet           | `eq`, `ne`, `in`, `nin`                             |
| preptime       | `gt`, `gte`, `lt`, `lte`, `bw`, `nbw`              |
| cooktime       | `gt`, `gte`, `lt`, `lte`, `bw`, `nbw`              |
| flavorprofile  | `eq`, `ne`, `in`, `nin`                             |
| course         | `eq`, `ne`, `in`, `nin`                             |
| state          | `eq`, `ne`, `in`, `nin`                             |
| region         | `eq`, `ne`, `in`, `nin`                             |
| status         | `eq`, `ne`, `in`, `nin`                             |