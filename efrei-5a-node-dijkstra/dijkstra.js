class Path {
  constructor (cost, node) {
    /** @member {Number} cost */
    this.cost = cost
    /** @member {Node} node */
    this.node = node
  }
}

class Node {
  /**
   * @param {String} name
   * @param {Array<Path>} paths
   */
  constructor (name, paths = []) {
    /** @member {String} */
    this.name = name
    /** @member {Array<Path>} paths */
    this.paths = paths
    /** @member {Number} distance */
    this.distance = Infinity
    /** @member {Node} visitedFrom */
    this.visitedFrom = null
    /** @member {Boolean} visited */
    this.visited = false
  }

  /**
   * @param {Node} node
   * @param {Number} cost
   */
  addOrientedPath (node, cost) {
    const current = this.paths.findIndex(n => n.node === node)
    if (current !== -1) {
      this.paths.splice(current, 1)
    }
    this.paths.push(new Path(cost, node))
  }

  /**
   * @param {Node} node
   * @param {Number} cost
   */
  addNonOrientedPath (node, cost) {
    this.addOrientedPath(node, cost)
    node.addOrientedPath(this, cost)
  }

  /**
   * Calculates the new distance for each node
   * Already visited nodes shouldn't be updated
   * The {@link Node}s returned are the nodes which were never calculated before
   * @returns {Node[]|null}
   */
  calcNeighboursTentativeDistance () {
    const newNodes = []
    this.visited = true
    for (const path of this.paths) {
      if (path.node.visited === false) {
        const newDistance = this.distance + path.cost
        if (path.node.distance > newDistance) {
          if (path.node.distance === Infinity) {
            newNodes.push(path.node)
          }
          path.node.distance = newDistance
          path.node.visitedFrom = this
        }
      }
    }
    return newNodes.length > 0 ? newNodes : null
  }
}

class Dijkstra {
  /**
   * Calculates the shortest path, and returns a list of nodes
   * that we need to go through to have the path
   * @param {Node} startNode
   * @param {Node} endNode
   * @returns {Array<Node>}
   */
  static shortestPathFirst (startNode, endNode) {
    startNode.distance = 0
    startNode.visitedFrom = null
    let unvisited = []
    if (startNode === endNode) {
      return unvisited
    }
    unvisited.push(startNode)
    while (!endNode.visited && unvisited.sort((a, b) => a.distance - b.distance)[0].distance !== Infinity) {
      const currNode = unvisited.shift()
      const tempNodes = currNode.calcNeighboursTentativeDistance()
      if (tempNodes) unvisited.push(...tempNodes)
      unvisited = [...new Set(unvisited)]
    }
    return this.generatePath(endNode)
  }

  /**
   * Generates the path from an endNode to the startNode
   * it uses the `visitedFrom` property to navigate backwards
   * to the starting point
   * @param {Node} endNode
   * @returns {Node[]}
   */
  static generatePath (endNode) {
    const path = [endNode]
    while (path[path.length - 1].visitedFrom) {
      path.push(path[path.length - 1].visitedFrom)
    }
    path.reverse()
    return path
  }

  /**
   * Print the path like a linked list
   * @param {Node[]} listOfNodes
   */
  /* istanbul ignore next */
  static printPath (listOfNodes) {
    let out = ''
    for (const n of listOfNodes) {
      out += `(${n.name}, ${n.distance}) => `
    }
    out += 'x'
    console.log(out)
  }
}

module.exports = { Dijkstra, Path, Node }
