
(function () {
	DBSCAN = function () {
		var data =[];

		var eps;
		var clusters = [];
		var status = [];
		var distance = euclidean_distance;

		function euclidean_distance(point1,point2){
				return Math.sqrt(Math.pow((point1.properties.AgeSuspect - point2.properties.AgeSuspect), 2)+ Math.pow((point1.properties.AgeVictim - point2.properties.AgeVictim), 2)+ Math.pow((point1.properties.Time_occurance.hour - point2.properties.Time_occurance.hour), 2));
		};

		function getNeighbours(point_index){
				neighbours = [];
				var d = data[point_index];

				for(var i = 0; i< data.length; i++){
					if(point_index === i){
						continue;
					}
					if(distance(data[i],d) <= eps){
						neighbours.push(i);
					}
		}

		return neighbours;
	}

			function expand_cluster(point_index, neighbours, cluster_index) {
					clusters[cluster_index-1].push(point_index); // Add point to the cluster
					status[cluster_index] = cluster_index;	//Also asign the cluster to the index

					for( var i = 0; i < neighbours.length; i++){
						var currentPointIndex = neighbours[i];  //Get current index from neighbours

							if(status[currentPointIndex] === undefined) { //if we have not visited or assigned the current point

								status[currentPointIndex] = 0; //Marks that the point have been visited now
								var currentNeighbour = getNeighbours(currentPointIndex); //Get neighbours to the visited point
								var numCurrNeighbours = currentNeighbour.length; // Get amount of neighbours that matches our Epsilon
								if(numCurrNeighbours >= minPts){ //If  the cluster does not match our current set min number of points
									expand_cluster(currentPointIndex,currentNeighbour,cluster_index);	//Run expand cluster again to get more points!
								}
							}
							if(status[currentPointIndex] < 1){ //When current point is not assigned but visited (= 0)
								status[currentPointIndex] = cluster_index;
								clusters[cluster_index - 1].push(currentPointIndex);
							}
					}
			}


			var DBscan  = function(){
				//Creating variables


					for(var i = 0; i < data.length; i++){ // Loop through data to get each memeber

							if(status[i] === undefined){ //Status has not been visited yet
								status[i] = 0;
								var neighbours = getNeighbours(i); //Get neighbours of current index
								var NumNeighbours = neighbours.length; // Check length as before

								if(NumNeighbours < minPts){

									status[i] = 0; //Irrelant, treated as noise
								} else{ //creating empty cluster

									clusters.push([]);
									var cluster_index = clusters.length; //Reach index of new cluster with the knowledge that it is added at the end of the list.
									expand_cluster(i,neighbours,cluster_index	); //Expand around the new cluster!
								}
							}
					}



					return [status,clusters.length];
			};



			DBscan.data = function (d) {
			if (arguments.length === 0) {
				return data;

			}
			if (Array.isArray(d)) {
				data = d;
			}

			return DBscan;
		};

		DBscan.eps = function (e) {
			if (arguments.length === 0) {
				return eps;
			}
			if (typeof e === "number") {
				eps = e;
			}

			return DBscan;
		};

		DBscan.minPts = function (p) {
			if (arguments.length === 0) {

				return minPts;
			}
			if (typeof p === "number") {

				minPts = p;
			}

			return DBscan;
		};

		return DBscan;
}

})();
