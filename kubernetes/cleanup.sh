kubectl delete --cascade='foreground' -f frontend.yml
kubectl delete --cascade='foreground' -f audio.yml
kubectl delete --cascade='foreground' -f backend.yml
kubectl delete --cascade='foreground' -f postgres.yml
