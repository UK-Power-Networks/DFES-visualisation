#!/usr/bin/perl
# Convert a file that is organised as "LSOA":{"X":1}
# into one that is "X":["LSOA1","LSOA2","LSOA3"...]

open(FILE,$ARGV[0]);
@lines = <FILE>;
close(FILE);

%areas;

for($l = 0; $l < @lines; $l++){
	if($lines[$l] =~ /"([^\"]+)":\{"([^\"]+)"\:1\}/){
		$area = $2;
		$lsoa = $1;
		if($areas{$area}){ $areas{$area} .= ","; }
		$areas{$area} .= "\"$lsoa\"";
	}
}

print "{\n";
$i = 0;
foreach $area (sort(keys(%areas))){
	if($i > 0){ print ",\n"; }
	print "\t\"$area\":[$areas{$area}]";
	$i++;
}
print "\n}\n";